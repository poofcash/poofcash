import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { BlockscoutTxLink } from "components/Links";
import moment from "moment";
import React from "react";
import { Button, Container, Flex, Text } from "theme-ui";
import { parseNote } from "utils/snarks-functions";
import {
  GAS_HARDCODE,
  PRECISION,
} from "pages/WithdrawPage/MobileWithdrawPage/ConfirmWithdraw";
import { shortenAccount } from "hooks/accountName";
import { SummaryTable } from "components/SummaryTable";

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
      <Text sx={{ mb: 1 }} variant="subtitle">
        Alakazam!
      </Text>
      <Text sx={{ mb: 4 }} variant="regularGray">
        Your deposit is complete.{" "}
        <BlockscoutTxLink tx={txHash}>View transaction</BlockscoutTxLink>.
      </Text>

      <SummaryTable
        title="Transaction"
        lineItems={[
          {
            label: "Time completed",
            value: moment().format("h:mm a"),
          },
          {
            label: "Account",
            value: shortenAccount(recipient),
          },
          {
            label: "Withdraw amount",
            value: `${amount} ${currency.toUpperCase()}`,
          },
        ]}
        totalItem={{
          label: "Est. Withdrawal",
          value: `${finalWithdrawAmount
            .toString()
            .slice(0, PRECISION)} ${currency.toUpperCase()}`,
        }}
      />

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
