import React from "react";
import { decryptNotes, Note } from "@poofcash/poof-kit";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { Box, Button, Card, Flex, Heading, Spinner, Text } from "theme-ui";
import { fromWei, toHex } from "web3-utils";
import { formatCurrency } from "utils/currency";
import { ClipboardIcon } from "icons/ClipboardIcon";
import CopyToClipboard from "react-copy-to-clipboard";
import { useLatestBlockNumber } from "hooks/web3";
import { RefreshCw } from "react-feather";
import { createContainer } from "unstated-next";
import { EncryptedKeystoreV3Json } from "web3-core";
import { FixedSizeList } from "react-window";
import { useMiningRates } from "hooks/useMiningRates";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { getPoofEvents } from "utils/getPoofEvents";
import { getEncryptedNoteEvents } from "utils/getEncryptedNoteEvents";

type RowData = {
  note: Note;
  miningRate: number;
  latestBlock: number;
};

interface IItemProps {
  index: number;
  data: RowData[];
  style: React.CSSProperties;
}

const NoteItem: React.FC<IItemProps> = ({ index, data, style }) => {
  const { note, miningRate, latestBlock } = data[index];
  const noteAmount = `${Number(
    fromWei(note.amount)
  ).toLocaleString()} ${formatCurrency(note.currency)}`;
  const depositBlockNumber = note.depositBlock?.blockNumber ?? 0;
  const withdrawalBlockNumber =
    note.withdrawalBlock?.blockNumber ??
    Math.max(latestBlock, depositBlockNumber);
  const apEarned = depositBlockNumber
    ? (withdrawalBlockNumber - depositBlockNumber) * miningRate
    : 0;

  return (
    <Box style={style}>
      <Card mb={3}>
        <Flex
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Text variant="bold" mr={1}>
              Amount:
            </Text>
            <Text>{noteAmount}</Text>
            <br />
            <Text variant="bold" mr={1}>
              AP earned:
            </Text>
            <Text>{apEarned.toLocaleString()} AP</Text>
          </Box>
          <CopyToClipboard
            onCopy={() => {
              alert("Magic password copied to clipboard");
            }}
            text={note.toNoteString()}
          >
            <Button>
              <ClipboardIcon />
            </Button>
          </CopyToClipboard>
        </Flex>
      </Card>
    </Box>
  );
};

interface IListProps {
  title: string;
  poofAccount: EncryptedKeystoreV3Json | undefined;
  loading: boolean;
  rows: RowData[] | undefined;
  unlockDeposits: () => void;
}

const NoteList: React.FC<IListProps> = ({
  title,
  poofAccount,
  loading,
  rows,
  unlockDeposits,
}) => {
  if (!poofAccount) {
    return null;
  }

  return (
    <Box>
      <Flex
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}
      >
        <Heading as="h2" mb={2}>
          {title}
        </Heading>
        {rows && (
          <Button
            sx={{ bg: "highlight", color: "text" }}
            onClick={unlockDeposits}
          >
            <RefreshCw />
          </Button>
        )}
      </Flex>
      {loading ? (
        <Spinner />
      ) : rows ? (
        <FixedSizeList
          height={240}
          width="100%"
          itemData={rows}
          itemCount={rows.length}
          itemSize={80}
          style={{ marginBottom: "16px" }}
        >
          {NoteItem}
        </FixedSizeList>
      ) : (
        <Button onClick={unlockDeposits}>Unlock notes</Button>
      )}
    </Box>
  );
};

const useDepositList = () => {
  const { poofAccount, actWithPoofAccount } = PoofAccountGlobal.useContainer();
  const { poofKit } = PoofKitGlobal.useContainer();
  const [latestBlock, refreshLatestBlock] = useLatestBlockNumber();
  const [loading, setLoading] = React.useState(false);
  const [deposits, setDeposits] = React.useState<RowData[]>();
  const [withdrawals, setWithdrawals] = React.useState<RowData[]>();
  const [miningRates] = useMiningRates();

  const unlockDeposits = React.useCallback(() => {
    setLoading(true);
    refreshLatestBlock();
    actWithPoofAccount(
      async (privateKey) => {
        const [
          encryptedNoteEvents,
          depositEvents,
          withdrawEvents,
        ] = await Promise.all([
          getEncryptedNoteEvents(poofKit),
          getPoofEvents("Deposit", poofKit),
          getPoofEvents("Withdrawal", poofKit),
        ]);
        const decryptedNotes = decryptNotes(privateKey, encryptedNoteEvents);
        const rows = decryptedNotes.map((noteString) => {
          const poofAddress = Note.getInstance(noteString);
          const miningRate = miningRates[poofAddress] || 0;
          const note = Note.fromString(
            noteString,
            depositEvents ? depositEvents[poofAddress] : [],
            withdrawEvents ? withdrawEvents[poofAddress] : []
          );
          return {
            note,
            latestBlock,
            miningRate,
          };
        });
        const deposits = rows.filter((row) => row.note.withdrawalBlock == null);
        const withdrawals = (
          await Promise.all(
            rows.map(async (row) => {
              const isMined = await poofKit.isMined(
                toHex(row.note.rewardNullifier)
              );
              return { row, isMined };
            })
          )
        )
          .filter(({ row, isMined }) => {
            return (
              row.note.withdrawalBlock != null && row.miningRate > 0 && !isMined
            );
          })
          .map(({ row }) => row);
        setDeposits(deposits);
        setWithdrawals(withdrawals);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
  }, [
    setLoading,
    actWithPoofAccount,
    setDeposits,
    refreshLatestBlock,
    latestBlock,
    miningRates,
    poofKit,
  ]);

  const props = {
    poofAccount,
    loading,
    unlockDeposits,
  };
  const depositList = (
    <NoteList title="Deposit List" rows={deposits} {...props} />
  );
  const withdrawList = (
    <NoteList title="Withdraw List" rows={withdrawals} {...props} />
  );

  return { depositList, withdrawList };
};

export const DepositListGlobal = createContainer(useDepositList);
