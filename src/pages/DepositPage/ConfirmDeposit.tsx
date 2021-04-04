import React from "react";
import { Button, Container, Flex, Grid, Spinner, Text } from "theme-ui";
import { NoteStringCommitment } from "pages/DepositPage";
import { DepositState } from "hooks/writeContract";
import { BackButton } from "components/BackButton";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { Divider } from "components/Divider";
import { TableDivider } from "components/TableDivider";
import { NoteString } from "components/NoteString";

interface IProps {
  onBackClick: () => void;
  onConfirmClick: () => void;
  selectedAmount: string;
  selectedCurrency: string;
  noteStringCommitment: NoteStringCommitment;
  depositState: DepositState;
  depositCallback: () => void;
}

export const NETWORK_COST = 0.0048;

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
      <Text sx={{ mb: 1 }} variant="subtitle">
        Transaction Summary
      </Text>
      <Text sx={{ mb: 4 }} variant="regular">
        Please review the transaction before continuing
      </Text>
      <Text variant="summaryTitle">Summary</Text>
      <Divider />
      <Grid columns={[2]} sx={{ mb: 4 }}>
        <Text variant="form">Deposit Amount</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          {selectedAmount} {selectedCurrency.toUpperCase()}
        </Text>
        <Text variant="form">Network Fee</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          {NETWORK_COST} CELO
        </Text>
        <TableDivider columns={2} />
        <Text variant="subtitle">Total</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          {totalCost} CELO
        </Text>
      </Grid>

      <Text sx={{ mb: 1 }} variant="subtitle">
        Magic Password
      </Text>
      <Text sx={{ mb: 3 }} variant="regular">
        Keep this note safe to withdraw the deposited money later
      </Text>
      <NoteString noteString={noteStringCommitment.noteString} />
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
                depositCallback();
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
