import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { BlockscoutTxLink } from "components/Links";
import moment from "moment";
import React from "react";
import { Box, Button, Container, Flex, Text } from "theme-ui";
import { parseNote } from "utils/snarks-functions";
import { GAS_HARDCODE } from "./ConfirmWithdraw";

interface IProps {
  onDoneClick: () => void;
  note: string;
  txHash: string;
  tornadoServiceFee: string;
}

export const WithdrawReceipt: React.FC<IProps> = ({
  onDoneClick,
  note,
  txHash,
  tornadoServiceFee,
}) => {
  const { amount, currency } = parseNote(note);

  const relayerFee = (Number(amount) * Number(tornadoServiceFee)) / 100;
  const finalWithdrawAmount = Number(amount) - relayerFee - GAS_HARDCODE;

  return (
    <Container>
      <Text sx={{ mb: 4 }}>
        Your withdrawal was successful!{" "}
        <BlockscoutTxLink tx={txHash}>View transaction</BlockscoutTxLink>.
      </Text>
      <Box sx={{ mb: 4, width: "100%", height: "64px", bg: "#EEEEEE" }} />
      <Text>Receipt</Text>
      <Flex sx={{ justifyContent: "space-between", mb: 4 }}>
        <Text>
          {amount} {currency.toUpperCase()}
        </Text>
        <Text>{moment().format("h:mm a")}</Text>
      </Flex>
      <BottomDrawer>
        <Flex sx={{ justifyContent: "space-between" }}>
          <LabelWithBalance
            label="Withdrew"
            amount={finalWithdrawAmount.toString()}
            currency={currency.toUpperCase()}
          />
          <Button
            onClick={() => {
              onDoneClick();
            }}
          >
            Done
          </Button>
        </Flex>
      </BottomDrawer>
    </Container>
  );
};
