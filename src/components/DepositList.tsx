import React from "react";
import { NoteInfo } from "@poofcash/poof-kit";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { Box, Button, Card, Flex, Heading, Spinner, Text } from "theme-ui";
import { isValidNote } from "utils/snarks-functions";
import { fromWei } from "web3-utils";
import { formatCurrency } from "utils/currency";
import { ClipboardIcon } from "icons/ClipboardIcon";
import CopyToClipboard from "react-copy-to-clipboard";
import { useLatestBlockNumber } from "hooks/web3";
import { RefreshCw } from "react-feather";
import { createContainer } from "unstated-next";
import { EncryptedKeystoreV3Json } from "web3-core";

interface IProps {
  title: string;
  poofAccount: EncryptedKeystoreV3Json | undefined;
  latestBlock: number;
  loading: boolean;
  notes: NoteInfo[] | undefined;
  unlockDeposits: () => void;
}

const NoteList: React.FC<IProps> = ({
  title,
  poofAccount,
  latestBlock,
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
        notes.map((deposit) => {
          const noteAmount = `${Number(
            fromWei(deposit.note.amount)
          ).toLocaleString()} ${formatCurrency(deposit.note.currency)}`;
          const depositBlockNumber = deposit.depositBlock!.blockNumber;
          const apEarned =
            ((deposit.withdrawBlock?.blockNumber ??
              Math.max(latestBlock, depositBlockNumber)) -
              depositBlockNumber) *
            deposit.rate;

          return (
            <Card mb={3}>
              <Flex
                sx={{ justifyContent: "space-between", alignItems: "center" }}
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
                  text={deposit.noteString}
                >
                  <Button>
                    <ClipboardIcon />
                  </Button>
                </CopyToClipboard>
              </Flex>
            </Card>
          );
        })
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
  const [deposits, setDeposits] = React.useState<NoteInfo[]>();
  const [withdrawals, setWithdrawals] = React.useState<NoteInfo[]>();

  const unlockDeposits = React.useCallback(() => {
    setLoading(true);
    refreshLatestBlock();
    actWithPoofAccount(
      (privateKey) => {
        poofKit.encryptedNotes(privateKey).then((v) => {
          const notes = v
            .filter(
              (note) =>
                isValidNote(note.noteString) && note.depositBlock != null
            )
            .sort(
              (a, b) =>
                b.depositBlock!.blockNumber - a.depositBlock!.blockNumber
            );
          const deposits = notes.filter((v) => v.withdrawBlock == null);
          const withdrawals = notes.filter((v) => v.withdrawBlock != null);
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
  ]);

  const depositListProps = {
    poofAccount,
    latestBlock,
    loading,
    unlockDeposits,
  };
  const depositList = (
    <NoteList title="Deposit List" notes={deposits} {...depositListProps} />
  );
  const withdrawList = (
    <NoteList title="Withdraw List" notes={withdrawals} {...depositListProps} />
  );

  return { depositList, withdrawList };
};

export const DepositListGlobal = createContainer(useDepositList);
