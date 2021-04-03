import React from "react";
import {
  Button,
  Container,
  Flex,
  Grid,
  Spinner,
  Text,
  Textarea,
} from "theme-ui";
import { NoteStringCommitment } from "pages/DepositPage";
import { DepositState } from "hooks/writeContract";
import { BackButton } from "components/BackButton";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";

interface IProps {
  onBackClick: () => void;
  onConfirmClick: () => void;
  selectedAmount: string;
  selectedCurrency: string;
  noteStringCommitment: NoteStringCommitment;
  depositState: DepositState;
  depositCallback: (commitment: string) => void;
}

const NETWORK_COST = 0.0048;

export const ConfirmDeposit: React.FC<IProps> = ({
  onBackClick,
  onConfirmClick,
  selectedAmount,
  selectedCurrency,
  noteStringCommitment,
  depositState,
  depositCallback,
}) => {
  React.useEffect(() => {
    if (depositState === DepositState.DONE) {
      onConfirmClick();
    }
  }, [depositState, onConfirmClick]);

  const totalCost = Number(selectedAmount) + Number(NETWORK_COST);

  return (
    <Container>
      <BackButton onClick={onBackClick} />
      <Text sx={{ mb: 4 }}>Confirm Transaction</Text>
      <Text>Summary</Text>
      <Grid columns={[2]} sx={{ mb: 4 }}>
        <Text>Deposit Amount</Text>
        <Text>
          {selectedAmount} {selectedCurrency.toUpperCase()}
        </Text>
        <Text>Network Fee</Text>
        <Text>{NETWORK_COST} CELO</Text>
        <div
          style={{
            margin: "-8px",
            height: "1px",
            gridColumnStart: 1,
            gridColumnEnd: 3,
            background: "black",
          }}
        ></div>
        <Text>Total</Text>
        <Text>{totalCost} CELO</Text>
      </Grid>

      <Text>Withdrawal Note</Text>
      <Text>Keep this note to withdraw your deposit.</Text>
      <Textarea
        sx={{ mb: 4 }}
        readOnly
        rows={4}
        value={noteStringCommitment.noteString}
      />
      <BottomDrawer>
        {depositState === DepositState.PENDING ? (
          <Flex sx={{ justifyContent: "flex-end" }}>
            <Spinner />
          </Flex>
        ) : (
          <Flex sx={{ justifyContent: "space-between" }}>
            <LabelWithBalance
              label="Total"
              amount={totalCost.toString()}
              currency={selectedCurrency.toUpperCase()}
            />
            <Button
              onClick={() => {
                depositCallback(noteStringCommitment.commitment);
              }}
            >
              Confirm
            </Button>
          </Flex>
        )}
      </BottomDrawer>
    </Container>
  );
};
