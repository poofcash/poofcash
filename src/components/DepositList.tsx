import React from "react";
import { NoteInfo } from "@poofcash/poof-kit";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { Box, Button, Card, Flex, Heading, Spinner, Text } from "theme-ui";
import { fromWei } from "web3-utils";
import { formatCurrency } from "utils/currency";
import { ClipboardIcon } from "icons/ClipboardIcon";
import CopyToClipboard from "react-copy-to-clipboard";
import { useLatestBlockNumber } from "hooks/web3";
import { RefreshCw } from "react-feather";
import { createContainer } from "unstated-next";
import { EncryptedKeystoreV3Json } from "web3-core";
import { FixedSizeList } from "react-window";
import { useEncryptedNoteEvents } from "hooks/useEncryptedNoteEvents";
import { usePoofEvents } from "hooks/usePoofEvents";

type ExtendedNoteInfo = NoteInfo & { latestBlock: number };

interface IItemProps {
  index: number;
  data: ExtendedNoteInfo[];
  style: React.CSSProperties;
}

const NoteItem: React.FC<IItemProps> = ({ index, data, style }) => {
  const noteInfo = data[index];
  const { latestBlock } = noteInfo;
  const noteAmount = `${Number(
    fromWei(noteInfo.note.amount)
  ).toLocaleString()} ${formatCurrency(noteInfo.note.currency)}`;
  const depositBlockNumber = noteInfo.depositBlock!.blockNumber;
  const apEarned =
    ((noteInfo.withdrawBlock?.blockNumber ??
      Math.max(latestBlock, depositBlockNumber)) -
      depositBlockNumber) *
    noteInfo.rate;

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
            text={noteInfo.noteString}
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
  notes: ExtendedNoteInfo[] | undefined;
  unlockDeposits: () => void;
}

const NoteList: React.FC<IListProps> = ({
  title,
  poofAccount,
  loading,
  notes,
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
        {notes && (
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
      ) : notes ? (
        <FixedSizeList
          height={240}
          width="100%"
          itemData={notes}
          itemCount={notes.length}
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
  const { poofKit } = PoofKitGlobal.useContainer();
  const { poofAccount, actWithPoofAccount } = PoofAccountGlobal.useContainer();
  const [latestBlock, refreshLatestBlock] = useLatestBlockNumber();
  const [loading, setLoading] = React.useState(false);
  const [deposits, setDeposits] = React.useState<ExtendedNoteInfo[]>();
  const [withdrawals, setWithdrawals] = React.useState<ExtendedNoteInfo[]>();
  const [encryptedNoteEvents] = useEncryptedNoteEvents();
  const [depositEvents] = usePoofEvents("Deposit");
  const [withdrawEvents] = usePoofEvents("Withdraw");

  const unlockDeposits = React.useCallback(() => {
    setLoading(true);
    refreshLatestBlock();
    actWithPoofAccount(
      (privateKey) => {
        poofKit
          .decryptedNotes(
            privateKey,
            encryptedNoteEvents,
            depositEvents,
            withdrawEvents
          )
          .then((v) => {
            const notes = v
              .filter((note) => note.depositBlock != null)
              .sort(
                (a, b) =>
                  b.depositBlock!.blockNumber - a.depositBlock!.blockNumber
              )
              .map((a) => ({ ...a, latestBlock }));
            const deposits = notes.filter((v) => v.withdrawBlock == null);
            const withdrawals = notes.filter(
              (v) => v.withdrawBlock != null && !v.isMined && v.rate > 0
            );
            setDeposits(deposits);
            setWithdrawals(withdrawals);
            setLoading(false);
          });
      },
      () => {
        setLoading(false);
      }
    );
  }, [
    setLoading,
    actWithPoofAccount,
    poofKit,
    setDeposits,
    refreshLatestBlock,
    latestBlock,
    encryptedNoteEvents,
    depositEvents,
    withdrawEvents,
  ]);

  const props = {
    poofAccount,
    loading,
    unlockDeposits,
  };
  const depositList = (
    <NoteList title="Deposit List" notes={deposits} {...props} />
  );
  const withdrawList = (
    <NoteList title="Withdraw List" notes={withdrawals} {...props} />
  );

  return { depositList, withdrawList };
};

export const DepositListGlobal = createContainer(useDepositList);
