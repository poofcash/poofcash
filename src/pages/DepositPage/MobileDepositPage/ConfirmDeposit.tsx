import React from "react";
import { Button, Checkbox, Container, Flex, Spinner, Text } from "theme-ui";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { DepositState } from "hooks/writeContract";
import { BackButton } from "components/BackButton";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { NoteString } from "components/NoteString";
import { SummaryTable } from "components/SummaryTable";

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
  const [confirmed, setConfirmed] = React.useState(false);
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
      <Text sx={{ mb: 4 }} variant="regularGray">
        Please review the transaction before continuing
      </Text>
      <SummaryTable
        title="Summary"
        lineItems={[
          {
            label: "Deposit Amount",
            value: `${selectedAmount} ${selectedCurrency.toUpperCase()}`,
          },
          {
            label: "Est. Network Fee",
            value: `${NETWORK_COST} CELO`,
          },
        ]}
        totalItem={{
          label: "Est. Total",
          value: `${totalCost} CELO`,
        }}
      />

      <Text sx={{ mb: 1 }} variant="subtitle">
        Magic Password
      </Text>
      <Text sx={{ mb: 3 }} variant="regularGray">
        Keep this note safe to withdraw the deposited money later
      </Text>
      <NoteString noteString={noteStringCommitment.noteString} />
      <Flex
        sx={{ mt: 4, alignItems: "center" }}
        onClick={() => setConfirmed(!confirmed)}
      >
        <Checkbox readOnly checked={confirmed} />
        <Text sx={{ pt: 1 }}>I backed up the Magic Password</Text>
      </Flex>
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
              disabled={!confirmed}
              variant="primary"
            >
              Deposit
            </Button>
          </Flex>
        )}
      </BottomDrawer>
    </Container>
  );
};
