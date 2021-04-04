import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { BlockscoutTxLink } from "components/Links";
import moment from "moment";
import React from "react";
import { Box, Button, Container, Flex, Grid, Text } from "theme-ui";
import { parseNote } from "utils/snarks-functions";
import { GAS_HARDCODE, PRECISION } from "pages/WithdrawPage/ConfirmWithdraw";
import { Divider } from "components/Divider";
import { TableDivider } from "components/TableDivider";
import { shortenAccount } from "hooks/accountName";

interface IProps {
  onDoneClick: () => void;
  note: string;
  txHash: string;
  tornadoServiceFee: string;
  recipient: string;
}

export const WithdrawReceipt: React.FC<IProps> = ({
  onDoneClick,
  note,
  txHash,
  tornadoServiceFee,
  recipient,
}) => {
  const { amount, currency } = parseNote(note);

  const relayerFee = (Number(amount) * Number(tornadoServiceFee)) / 100;
  const finalWithdrawAmount = Number(amount) - relayerFee - GAS_HARDCODE;

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
        <Text variant="form">Recipient</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          {shortenAccount(recipient)}
        </Text>
        <Text variant="form">Total amount</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          {amount} {currency.toUpperCase()}
        </Text>
        <TableDivider columns={2} />
        <Text variant="subtitle">Withdrawal</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          {finalWithdrawAmount.toString().slice(0, PRECISION)}{" "}
          {currency.toUpperCase()}
        </Text>
      </Grid>

      <BottomDrawer>
        <Flex sx={{ justifyContent: "space-between" }}>
          <LabelWithBalance
            label="Withdrew"
            amount={finalWithdrawAmount.toString().slice(0, PRECISION)}
            currency={currency.toUpperCase()}
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
