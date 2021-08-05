import React from "react";
import { decryptNotes, Note } from "@poofcash/poof-kit";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { Box, Button, Card, Flex, Heading, Spinner, Text } from "theme-ui";
import { fromWei } from "web3-utils";
import { formatCurrency } from "utils/currency";
import { ClipboardIcon } from "icons/ClipboardIcon";
import CopyToClipboard from "react-copy-to-clipboard";
import { useLatestBlockNumber } from "hooks/web3";
import { Edit3, RefreshCw } from "react-feather";
import { createContainer } from "unstated-next";
import { FixedSizeList } from "react-window";
import { useMiningRates } from "hooks/useMiningRates";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { getPoofEvents } from "utils/getPoofEvents";
import { getEncryptedNoteEvents } from "utils/getEncryptedNoteEvents";
import { toHex } from "utils/snarks-functions";
import { toast } from "react-toastify";

type RowData = {
  note: Note;
  miningRate: number;
};

interface IItemProps {
  index: number;
  data: {
    rows: RowData[];
    latestBlock: number;
    onFill?: (magicPassword: string) => any;
  };
  style: React.CSSProperties;
}

const NoteItem: React.FC<IItemProps> = ({ index, data, style }) => {
  const { rows, latestBlock, onFill } = data;
  const { note, miningRate } = rows[index];
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
          <Box>
            {onFill && (
              <Button
                sx={{ px: [2, 3] }}
                onClick={() => onFill(note.toNoteString())}
                mr={1}
              >
                <Edit3 />
              </Button>
            )}
            <CopyToClipboard
              onCopy={() => {
                toast("Magic password copied to clipboard");
              }}
              text={note.toNoteString()}
            >
              <Button sx={{ px: [2, 3] }}>
                <ClipboardIcon />
              </Button>
            </CopyToClipboard>
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};

export enum NoteListMode {
  DEPOSITS = "DEPOSITS",
  WITHDRAWS = "WIHTDRAWS",
}

interface IListProps {
  mode: NoteListMode;
  onFill?: (magicPassword: string) => any;
}

export const NoteList: React.FC<IListProps> = ({ mode, onFill }) => {
  const { poofAccount } = PoofAccountGlobal.useContainer();
  const [latestBlock] = useLatestBlockNumber();
  const {
    unlockDeposits,
    loading,
    deposits,
    withdrawals,
  } = DepositListGlobal.useContainer();
  if (!poofAccount) {
    return null;
  }

  let rows: RowData[] | undefined;
  let title;
  if (mode === NoteListMode.DEPOSITS) {
    rows = deposits;
    title = "Active Notes";
  } else if (mode === NoteListMode.WITHDRAWS) {
    rows = withdrawals;
    title = "Mineable Notes";
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
          itemData={{ rows, latestBlock, onFill }}
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
  const { actWithPoofAccount } = PoofAccountGlobal.useContainer();
  const { poofKit } = PoofKitGlobal.useContainer();
  const [loading, setLoading] = React.useState(false);
  const [deposits, setDeposits] = React.useState<RowData[]>();
  const [withdrawals, setWithdrawals] = React.useState<RowData[]>();
  const [miningRates] = useMiningRates();

  const unlockDeposits = React.useCallback(() => {
    setLoading(true);
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
  }, [setLoading, actWithPoofAccount, setDeposits, miningRates, poofKit]);

  return { unlockDeposits, deposits, withdrawals, loading };
};

export const DepositListGlobal = createContainer(useDepositList);
