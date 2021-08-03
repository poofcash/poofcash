import React from "react";
import { Button, Checkbox, Container, Flex, Spinner, Text } from "theme-ui";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { BackButton } from "components/BackButton";
import { ActionDrawer } from "components/ActionDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { SummaryTable } from "components/SummaryTable";
import { humanFriendlyNumber } from "utils/number";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { Page } from "state/global";
import { NoteList } from "components/NoteList";
import { useHistory } from "react-router-dom";

interface IProps {
  onBackClick: () => void;
  onConfirmClick: () => void;
  amount: string;
  currency: string;
  notes: NoteStringCommitment[];
  depositLoading: boolean;
  backup: boolean;
  setBackup: (backup: boolean) => void;
}

export const NETWORK_COST = 0.0001;

export const ConfirmDeposit: React.FC<IProps> = ({
  onBackClick,
  onConfirmClick,
  amount,
  currency,
  notes,
  depositLoading,
  backup,
  setBackup,
}) => {
  const [confirmed, setConfirmed] = React.useState(false);
  const totalCost = Number(amount) + Number(NETWORK_COST);
  const history = useHistory();
  const { poofAccount } = PoofAccountGlobal.useContainer();

  let button = (
    <Button onClick={onConfirmClick} disabled={!confirmed} variant="primary">
      Deposit
    </Button>
  );
  if (backup && !poofAccount) {
    button = (
      <Button onClick={() => history.push(`/${Page.SETUP}`)} variant="primary">
        Conect Poof account
      </Button>
    );
  }

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
            value: `${humanFriendlyNumber(amount)} ${currency}`,
          },
          {
            label: "Est. Network Fee",
            value: `${humanFriendlyNumber(NETWORK_COST)} CELO`,
          },
        ]}
        totalItem={{
          label: "Est. Total",
          value:
            currency === "CELO"
              ? `${humanFriendlyNumber(
                  Number(amount) + Number(NETWORK_COST)
                )} CELO`
              : `${humanFriendlyNumber(
                  Number(amount)
                )} ${currency} + ${humanFriendlyNumber(NETWORK_COST)} CELO`,
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
      <NoteList notes={notes.map((note) => note.noteString)} />
      <Flex
        sx={{ mt: 4, alignItems: "center" }}
        onClick={() => setConfirmed(!confirmed)}
      >
        <Checkbox readOnly checked={confirmed} />
        <Text sx={{ pt: 1 }}>I backed up the Magic Password</Text>
      </Flex>
      <Flex
        sx={{ my: 4, alignItems: "center" }}
        onClick={() => setBackup(!backup)}
      >
        <Checkbox readOnly checked={backup} />
        <Text sx={{ pt: 1 }}>Create an on-chain backup</Text>
      </Flex>
      <ActionDrawer>
        {depositLoading ? (
          <Flex sx={{ justifyContent: "flex-end" }}>
            <Spinner />
          </Flex>
        ) : (
          <Flex sx={{ justifyContent: "space-between" }}>
            <LabelWithBalance
              label="Total"
              amount={totalCost.toString()}
              currency={currency}
            />
            {button}
          </Flex>
        )}
      </ActionDrawer>
    </Container>
  );
};
