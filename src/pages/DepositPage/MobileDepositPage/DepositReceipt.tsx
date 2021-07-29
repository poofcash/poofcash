import React from "react";
import { Button, Container, Flex, Text } from "theme-ui";
import moment from "moment";
import { BlockscoutTxLink } from "components/Links";
import { ActionDrawer } from "components/ActionDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { shortenAccount } from "hooks/accountName";
import { NETWORK_COST } from "pages/DepositPage/MobileDepositPage/ConfirmDeposit";
import { SummaryTable } from "components/SummaryTable";
import { useContractKit } from "@celo-tools/use-contractkit";
import { humanFriendlyNumber } from "utils/number";

interface IProps {
  onDoneClick: () => void;
  amount: string;
  currency: string;
  txHash: string;
}

export const DepositReceipt: React.FC<IProps> = ({
  onDoneClick,
  amount,
  currency,
  txHash,
}) => {
  const { address } = useContractKit();

  return (
    <Container>
      <Text sx={{ mb: 1 }} variant="subtitle">
        Alakazam!
      </Text>
      <br />
      <Text sx={{ mb: 4 }} variant="regular">
        Your deposit is complete.{" "}
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
            value: shortenAccount(address),
          },
          {
            label: "Est. total amount",
            value:
              currency === "CELO"
                ? `${humanFriendlyNumber(
                    Number(amount) + Number(NETWORK_COST)
                  )} CELO`
                : `${humanFriendlyNumber(
                    amount
                  )} ${currency} + ${humanFriendlyNumber(NETWORK_COST)} CELO`,
          },
        ]}
        totalItem={{
          label: "Deposit",
          value: `${humanFriendlyNumber(amount)} ${currency}`,
        }}
      />

      <ActionDrawer>
        <Flex sx={{ justifyContent: "space-between" }}>
          <LabelWithBalance
            label="Deposited"
            amount={amount}
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
