import React from "react";
import { Button, Container, Text } from "theme-ui";
import moment from "moment";
import { BlockscoutTxLink } from "components/Links";
import { useAccountName } from "hooks/accountName";
import { NETWORK_COST } from "pages/DepositPage/MobileDepositPage/ConfirmDeposit";
import { SummaryTable } from "components/SummaryTable";
import { GrayBox } from "components/GrayBox";
import { humanFriendlyNumber } from "utils/number";

interface IProps {
  onDoneClick: () => void;
  amount: string;
  selectedCurrency: string;
  txHash: string;
}

export const DepositReceipt: React.FC<IProps> = ({
  onDoneClick,
  amount,
  selectedCurrency,
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
        Your deposit is complete.{" "}
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
              label: "Est. total amount",
              value:
                selectedCurrency === "CELO"
                  ? `${humanFriendlyNumber(
                      Number(amount) + Number(NETWORK_COST)
                    )} CELO`
                  : `${humanFriendlyNumber(
                      amount
                    )} ${selectedCurrency} + ${humanFriendlyNumber(
                      NETWORK_COST
                    )} CELO`,
            },
          ]}
          totalItem={{
            label: "Deposit",
            value: `${humanFriendlyNumber(amount)} ${selectedCurrency}`,
          }}
        />
      </GrayBox>

      <Button sx={{ mt: 2, px: 6 }} variant="done" onClick={onDoneClick}>
        Done
      </Button>
    </Container>
  );
};
