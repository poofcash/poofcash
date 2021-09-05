import React from "react";
import { Button, Container, Text } from "theme-ui";
import moment from "moment";
import { BlockscoutTxLink } from "components/Links";
import { useAccountName } from "hooks/accountName";
import { SummaryTable } from "components/SummaryTable";
import { GrayBox } from "components/GrayBox";

interface IProps {
  onDoneClick: () => void;
  refundAmount: string;
  txHash: string;
}

export const RefundReceipt: React.FC<IProps> = ({
  onDoneClick,
  refundAmount,
  txHash,
}) => {
  const accountName = useAccountName();

  return (
    <Container>
      <Text sx={{ mb: 1 }} variant="title">
        Alakazam!
      </Text>
      <br />
      <Text sx={{ mb: 4 }} variant="regularGray">
        Your refund is complete.{" "}
        <BlockscoutTxLink tx={txHash}>View transaction</BlockscoutTxLink>.
      </Text>

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
              value: accountName,
            },
            {
              label: "Total amount",
              value: `${refundAmount} ULP`,
            },
          ]}
          totalItem={{
            label: "Refund",
            value: `${refundAmount} ULP`,
          }}
        />
      </GrayBox>

      <Button sx={{ mt: 2, px: 6 }} variant="done" onClick={onDoneClick}>
        Done
      </Button>
    </Container>
  );
};
