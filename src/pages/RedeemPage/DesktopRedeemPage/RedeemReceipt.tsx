import { BlockscoutTxLink } from "components/Links";
import moment from "moment";
import React from "react";
import { Button, Container, Text } from "theme-ui";
import { PRECISION } from "pages/RedeemPage/MobileRedeemPage/ConfirmRedeem";
import { shortenAccount } from "hooks/accountName";
import { GrayBox } from "components/GrayBox";
import { SummaryTable } from "components/SummaryTable";

interface IProps {
  onDoneClick: () => void;
  amount: string;
  poofAmount: string;
  txHash: string;
  poofServiceFee: number;
  recipient: string;
}

export const RedeemReceipt: React.FC<IProps> = ({
  onDoneClick,
  amount,
  poofAmount,
  txHash,
  recipient,
}) => {
  return (
    <Container>
      <Text sx={{ mb: 1 }} variant="title">
        Alakazam!
      </Text>
      <Text sx={{ mb: 4 }} variant="regularGray">
        Your redemption is complete.{" "}
        <BlockscoutTxLink tx={txHash}>View transaction</BlockscoutTxLink>.
      </Text>

      <GrayBox>
        <Text sx={{ mb: 3 }} variant="subtitle">
          Receipt
        </Text>
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
              label: "AP used",
              value: `${amount} AP`,
            },
          ]}
          totalItem={{
            label: "Est. Redemption",
            value: `${poofAmount.toString().slice(0, PRECISION)} POOF`,
          }}
        />
      </GrayBox>

      <Button sx={{ mt: 2, px: 6 }} variant="done" onClick={onDoneClick}>
        Done
      </Button>
    </Container>
  );
};
