import React from "react";
import { Box, Button, Container, Flex, Grid, Text } from "theme-ui";
import moment from "moment";
import { BlockscoutTxLink } from "components/Links";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { Divider } from "components/Divider";
import { useAccountName } from "hooks/accountName";
import { TableDivider } from "components/TableDivider";
import { NETWORK_COST } from "pages/DepositPage/ConfirmDeposit";

interface IProps {
  onDoneClick: () => void;
  selectedAmount: string;
  selectedCurrency: string;
  txHash: string;
}

export const DepositReceipt: React.FC<IProps> = ({
  onDoneClick,
  selectedAmount,
  selectedCurrency,
  txHash,
}) => {
  const accountName = useAccountName();

  return (
    <Container>
      <Box sx={{ mb: 4, width: "100%", height: "64px", bg: "#EEEEEE" }} />
      <Text sx={{ mb: 1 }} variant="subtitle">
        Alakazam!
      </Text>
      <Text sx={{ mb: 4 }} variant="regular">
        Your deposit is complete.{" "}
        <BlockscoutTxLink tx={txHash}>View transaction</BlockscoutTxLink>.
      </Text>

      <Text variant="summaryTitle">Transaction</Text>
      <Divider />
      <Grid columns={[2]} sx={{ mb: 4 }}>
        <Text variant="form">Time completed</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          {moment().format("h:mm a")}
        </Text>
        <Text variant="form">Account</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          {accountName}
        </Text>
        <Text variant="form">Total amount</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          {Number(selectedAmount) + NETWORK_COST} CELO
        </Text>
        <TableDivider columns={2} />
        <Text variant="subtitle">Deposit</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          {Number(selectedAmount)} CELO
        </Text>
      </Grid>

      <BottomDrawer>
        <Flex sx={{ justifyContent: "space-between" }}>
          <LabelWithBalance
            label="Deposited"
            amount={selectedAmount}
            currency={selectedCurrency.toUpperCase()}
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
