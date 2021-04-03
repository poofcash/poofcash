import React from "react";
import { Box, Button, Container, Flex, Text } from "theme-ui";
import { NoteStringCommitment } from "pages/DepositPage";
import moment from "moment";
import { BlockscoutTxLink } from "components/Links";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { NoteString } from "components/NoteString";

interface IProps {
  onDoneClick: () => void;
  selectedAmount: string;
  selectedCurrency: string;
  noteStringCommitment: NoteStringCommitment;
  txHash: string;
}

export const DepositReceipt: React.FC<IProps> = ({
  onDoneClick,
  selectedAmount,
  selectedCurrency,
  noteStringCommitment,
  txHash,
}) => {
  return (
    <Container>
      <Text sx={{ mb: 4 }}>
        Your deposit was successful!{" "}
        <BlockscoutTxLink tx={txHash}>View transaction</BlockscoutTxLink>.
      </Text>
      <Box sx={{ mb: 4, width: "100%", height: "64px", bg: "#EEEEEE" }} />
      <Text>Receipt</Text>
      <Flex sx={{ justifyContent: "space-between", mb: 4 }}>
        <Text>
          {selectedAmount} {selectedCurrency.toUpperCase()}
        </Text>
        <Text>{moment().format("h:mm a")}</Text>
      </Flex>

      <Text>Withdrawal Note</Text>
      <Text>Keep this note to withdraw your deposit.</Text>
      <NoteString noteString={noteStringCommitment.noteString} />
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
          >
            Done
          </Button>
        </Flex>
      </BottomDrawer>
    </Container>
  );
};
