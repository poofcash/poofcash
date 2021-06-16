import React from "react";
import { CHAIN_ID } from "config";
import { getNoteStringAndCommitment } from "utils/snarks-functions";
import { useDepositCallback } from "hooks/writeContract";
import { PickDeposit } from "pages/DepositPage/MobileDepositPage/PickDeposit";
import { ConfirmDeposit } from "pages/DepositPage/MobileDepositPage/ConfirmDeposit";
import { DepositReceipt } from "pages/DepositPage/MobileDepositPage/DepositReceipt";
import { NoteStringCommitment } from "pages/DepositPage/types";

enum DepositStep {
  PICKER = "PICKER",
  CONFIRM = "CONFIRM",
  RECEIPT = "RECEIPT",
}

export const initialNoteStringCommitment = {
  noteString: "",
  commitment: "",
};

interface IProps {
  setSelectedAmount: (amount: string) => void;
  selectedAmount: string;
  setSelectedCurrency: (currency: string) => void;
  selectedCurrency: string;
  setNoteStringCommitment: (noteStringCommitment: NoteStringCommitment) => void;
  noteStringCommitment: NoteStringCommitment;
}

// pass props and State interface to Component class
const MobileDepositPage: React.FC<IProps> = ({
  setSelectedAmount,
  selectedAmount,
  setSelectedCurrency,
  selectedCurrency,
  setNoteStringCommitment,
  noteStringCommitment,
}) => {
  const [depositStep, setDepositStep] = React.useState(DepositStep.PICKER);
  const [depositState, txHash, depositCallback] = useDepositCallback(
    noteStringCommitment.noteString
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
          txHash={txHash}
        />
      );
  }
};

export default MobileDepositPage;
