import React from "react";
import { CHAIN_ID } from "config";
import { getNoteStringAndCommitment } from "utils/snarks-functions";
import { useDepositCallback } from "hooks/writeContract";
import { PickDeposit } from "pages/DepositPage/PickDeposit";
import { ConfirmDeposit } from "pages/DepositPage/ConfirmDeposit";
import { DepositReceipt } from "pages/DepositPage/DepositReceipt";

export type NoteStringCommitment = {
  noteString: string;
  commitment: string;
};

enum DepositStep {
  PICKER = "PICKER",
  CONFIRM = "CONFIM",
  RECEIPT = "RECEIPT",
}

const initialNoteStringCommitment = {
  noteString: "",
  commitment: "",
};

// pass props and State interface to Component class
const DepositPage = () => {
  const [depositStep, setDepositStep] = React.useState(DepositStep.PICKER);
  const [selectedAmount, setSelectedAmount] = React.useState("");
  const [selectedCurrency, setSelectedCurrency] = React.useState("celo");
  const [
    noteStringCommitment,
    setNoteStringCommitment,
  ] = React.useState<NoteStringCommitment>(initialNoteStringCommitment);
  const [depositState, txHash, depositCallback] = useDepositCallback(
    Number(selectedAmount)
  );

  switch (depositStep) {
    case DepositStep.PICKER:
      return (
        <PickDeposit
          onDepositClick={() => {
            setDepositStep(DepositStep.CONFIRM);
            setNoteStringCommitment(
              getNoteStringAndCommitment(
                selectedCurrency,
                selectedAmount,
                CHAIN_ID
              )
            );
          }}
          selectedAmount={selectedAmount}
          setSelectedAmount={setSelectedAmount}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
        />
      );
    case DepositStep.CONFIRM:
      return (
        <ConfirmDeposit
          onBackClick={() => setDepositStep(DepositStep.PICKER)}
          onConfirmClick={() => setDepositStep(DepositStep.RECEIPT)}
          selectedAmount={selectedAmount}
          selectedCurrency={selectedCurrency}
          noteStringCommitment={noteStringCommitment}
          depositState={depositState}
          depositCallback={depositCallback}
        />
      );
    case DepositStep.RECEIPT:
      return (
        <DepositReceipt
          onDoneClick={() => {
            setNoteStringCommitment(initialNoteStringCommitment);
            setDepositStep(DepositStep.PICKER);
          }}
          selectedAmount={selectedAmount}
          selectedCurrency={selectedCurrency}
          noteStringCommitment={noteStringCommitment}
          txHash={txHash}
        />
      );
  }
};

export default DepositPage;
