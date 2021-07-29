import { ActionDrawer } from "components/ActionDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { BlockscoutTxLink } from "components/Links";
import moment from "moment";
import React from "react";
import { Button, Container, Flex, Text } from "theme-ui";
import { parseNote } from "utils/snarks-functions";
import { shortenAccount } from "hooks/accountName";
import { SummaryTable } from "components/SummaryTable";
import { humanFriendlyNumber } from "utils/number";
import { formatCurrency } from "utils/currency";

interface IProps {
  onDoneClick: () => void;
  note: string;
  txHash: string;
  recipient: string;
  relayerFee: string;
}

export const WithdrawReceipt: React.FC<IProps> = ({
  onDoneClick,
  note,
  txHash,
  recipient,
  relayerFee,
}) => {
  const { amount, currency } = parseNote(note);

  const finalWithdrawAmount = Number(amount) - Number(relayerFee);

  return (
    <Container>
      <Text sx={{ mb: 1 }} variant="subtitle">
        Alakazam!
      </Text>
      <br />
      <Text sx={{ mb: 4 }} variant="regularGray">
        Your withdrawal is complete.{" "}
        <BlockscoutTxLink tx={txHash}>View transaction</BlockscoutTxLink>.
      </Text>
      <br />

      <SummaryTable
        title="Transaction"
        lineItems={[
          {
            label: "Time completed",
            value: moment().format("h:mm a"),
          },
          {
            label: "Account",
            value: shortenAccount(recipient),
          },
          {
            label: "Withdraw amount",
            value: `${humanFriendlyNumber(amount)} ${formatCurrency(currency)}`,
          },
        ]}
        totalItem={{
          label: "Est. Withdrawal",
          value: `${humanFriendlyNumber(finalWithdrawAmount)} ${formatCurrency(
            currency
          )}`,
        }}
      />

      <ActionDrawer>
        <Flex sx={{ justifyContent: "space-between" }}>
          <LabelWithBalance
            label="Withdrew"
            amount={finalWithdrawAmount}
            currency={currency}
          />
          <Button
            onClick={() => {
              onDoneClick();
            }}
            variant="done"
          >
            Done
          </Button>
        </Flex>
      </ActionDrawer>
    </Container>
  );
};
