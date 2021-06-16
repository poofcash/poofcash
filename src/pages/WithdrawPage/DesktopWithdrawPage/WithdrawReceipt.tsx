import { BlockscoutTxLink } from "components/Links";
import moment from "moment";
import React from "react";
import { Button, Container, Text } from "theme-ui";
import { parseNote } from "utils/snarks-functions";
import {
  GAS_HARDCODE,
  PRECISION,
} from "pages/WithdrawPage/MobileWithdrawPage/ConfirmWithdraw";
import { shortenAccount } from "hooks/accountName";
import { GrayBox } from "components/GrayBox";
import { SummaryTable } from "components/SummaryTable";

interface IProps {
  onDoneClick: () => void;
  note: string;
  txHash: string;
  poofServiceFee: number;
  recipient: string;
}

export const WithdrawReceipt: React.FC<IProps> = ({
  onDoneClick,
  note,
  txHash,
  poofServiceFee,
  recipient,
}) => {
  const { amount, currency } = parseNote(note);

  const relayerFee = (Number(amount) * Number(poofServiceFee)) / 100;
  const finalWithdrawAmount = Number(amount) - relayerFee - GAS_HARDCODE;

  return (
    <Container>
      <Text sx={{ mb: 1 }} variant="title">
        Alakazam!
      </Text>
      <br />
      <Text sx={{ mb: 4 }} variant="regularGray">
        Your withdrawal is complete.{" "}
        <BlockscoutTxLink tx={txHash}>View transaction</BlockscoutTxLink>.
      </Text>
      <br />

      <GrayBox>
        <Text sx={{ mb: 3 }} variant="subtitle">
          Receipt
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
              value: `${amount} ${currency.toUpperCase()}`,
            },
          ]}
          totalItem={{
            label: "Est. Withdrawal",
            value: `${finalWithdrawAmount
              .toString()
              .slice(0, PRECISION)} ${currency.toUpperCase()}`,
          }}
        />
      </GrayBox>

      <Button sx={{ mt: 2, px: 6 }} variant="done" onClick={onDoneClick}>
        Done
      </Button>
    </Container>
  );
};
