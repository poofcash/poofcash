import React from "react";
import { Button, Checkbox, Container, Flex, Spinner, Text } from "theme-ui";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { BackButton } from "components/BackButton";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { NoteString } from "components/NoteString";
import { SummaryTable } from "components/SummaryTable";
import { humanFriendlyNumber } from "utils/number";

interface IProps {
  onBackClick: () => void;
  onConfirmClick: () => void;
  selectedAmount: string;
  selectedCurrency: string;
  noteStringCommitment: NoteStringCommitment;
  depositLoading: boolean;
}

export const NETWORK_COST = 0.0048;

export const ConfirmDeposit: React.FC<IProps> = ({
  onBackClick,
  onConfirmClick,
  selectedAmount,
  selectedCurrency,
  noteStringCommitment,
  depositLoading,
}) => {
  const [confirmed, setConfirmed] = React.useState(false);
  const totalCost = Number(selectedAmount) + Number(NETWORK_COST);

  return (
    <Container>
      <BackButton onClick={onBackClick} />
      <br />
      <Text sx={{ mb: 1 }} variant="subtitle">
        Transaction Summary
      </Text>
      <br />
      <Text sx={{ mb: 4 }} variant="regularGray">
        Please review the transaction before continuing
      </Text>
      <br />
      <SummaryTable
        title="Summary"
        lineItems={[
          {
            label: "Deposit Amount",
            value: `${humanFriendlyNumber(selectedAmount)} ${selectedCurrency}`,
          },
          {
            label: "Est. Network Fee",
            value: `${humanFriendlyNumber(NETWORK_COST)} CELO`,
          },
        ]}
        totalItem={{
          label: "Est. Total",
          value:
            selectedCurrency === "CELO"
              ? `${humanFriendlyNumber(
                  Number(selectedAmount) + Number(NETWORK_COST)
                )} CELO`
              : `${humanFriendlyNumber(
                  selectedAmount
                )} ${selectedCurrency} + ${humanFriendlyNumber(
                  NETWORK_COST
                )} CELO`,
        }}
      />

      <Text sx={{ mb: 1 }} variant="subtitle">
        Magic Password
      </Text>
      <br />
      <Text sx={{ mb: 3 }} variant="regularGray">
        Keep this note safe to withdraw the deposited money later
      </Text>
      <br />
      <NoteString noteString={noteStringCommitment.noteString} />
      <Flex
        sx={{ mt: 4, alignItems: "center" }}
        onClick={() => setConfirmed(!confirmed)}
      >
        <Checkbox readOnly checked={confirmed} />
        <Text sx={{ pt: 1 }}>I backed up the Magic Password</Text>
      </Flex>
      <BottomDrawer>
        {depositLoading ? (
          <Flex sx={{ justifyContent: "flex-end" }}>
            <Spinner />
          </Flex>
        ) : (
          <Flex sx={{ justifyContent: "space-between" }}>
            <LabelWithBalance
              label="Total"
              amount={totalCost.toString()}
              currency={selectedCurrency}
            />
            <Button
              onClick={onConfirmClick}
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
