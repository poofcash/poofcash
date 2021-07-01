import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { BlockscoutTxLink } from "components/Links";
import moment from "moment";
import React from "react";
import { Button, Container, Flex, Text } from "theme-ui";
import { PRECISION } from "pages/RedeemPage/MobileRedeemPage/ConfirmRedeem";
import { shortenAccount } from "hooks/accountName";
import { SummaryTable } from "components/SummaryTable";

interface IProps {
  onDoneClick: () => void;
  amount: string;
  poofAmount: string;
  txHash: string;
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
      <Text sx={{ mb: 1 }} variant="subtitle">
        Alakazam!
      </Text>
      <br />
      <Text sx={{ mb: 4 }} variant="regularGray">
        Your redemption is complete.{" "}
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
            label: "AP used",
            value: `${Number(amount).toLocaleString()} AP`,
          },
        ]}
        totalItem={{
          label: "Est. Redemption",
          value: `${poofAmount.toString().slice(0, PRECISION)} POOF`,
        }}
      />

      <BottomDrawer>
        <Flex sx={{ justifyContent: "space-between" }}>
          <LabelWithBalance
            label="Redeemed"
            amount={poofAmount}
            currency="POOF"
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
      </BottomDrawer>
    </Container>
  );
};
