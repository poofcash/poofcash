import { BlockscoutTxLink } from "components/Links";
import moment from "moment";
import React from "react";
import { Box, Button, Container, Flex, Text } from "theme-ui";
import { parseNote } from "utils/snarks-functions";

interface IProps {
  onDoneClick: () => void;
  note: string;
  txHash: string;
}

export const WithdrawReceipt: React.FC<IProps> = ({
  onDoneClick,
  note,
  txHash,
}) => {
  const { amount, currency } = parseNote(note);
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
      <Flex sx={{ justifyContent: "flex-end" }}>
        <Button
          onClick={() => {
            onDoneClick();
          }}
        >
          Done
        </Button>
      </Flex>
    </Container>
  );
};
