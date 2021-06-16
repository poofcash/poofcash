import React from "react";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { getNoteStringAndCommitment } from "utils/snarks-functions";
import { CHAIN_ID } from "config";
import { DoDeposit } from "pages/DepositPage/DesktopDepositPage/DoDeposit";
import { DepositReceipt } from "pages/DepositPage/DesktopDepositPage/DepositReceipt";
import { DepositState, useDepositCallback } from "hooks/writeContract";

enum DepositStep {
  DO = "DO",
  RECEIPT = "RECEIPT",
}

interface IProps {
  setSelectedAmount: (amount: string) => void;
  selectedAmount: string;
  setSelectedCurrency: (currency: string) => void;
  selectedCurrency: string;
  setNoteStringCommitment: (noteStringCommitment: NoteStringCommitment) => void;
  noteStringCommitment: NoteStringCommitment;
}

const DesktopDepositPage: React.FC<IProps> = ({
  setSelectedAmount,
  selectedAmount,
  setSelectedCurrency,
  selectedCurrency,
  setNoteStringCommitment,
  noteStringCommitment,
}) => {
  const [depositStep, setDepositStep] = React.useState(DepositStep.DO);
  const [depositState, txHash, depositCallback] = useDepositCallback(
    noteStringCommitment.noteString
  );
  React.useEffect(() => {
    if (depositState === DepositState.DONE) {
      setDepositStep(DepositStep.RECEIPT);
    }
  }, [depositState]);

  switch (depositStep) {
    case DepositStep.DO:
      return (
        <DoDeposit
          onDepositClick={depositCallback}
          selectedAmount={selectedAmount}
          setSelectedAmount={setSelectedAmount}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          noteStringCommitment={noteStringCommitment}
          depositState={depositState}
        />
      );
    case DepositStep.RECEIPT:
      return (
        <DepositReceipt
          onDoneClick={() => {
            setNoteStringCommitment(
              getNoteStringAndCommitment(
                selectedCurrency,
                selectedAmount,
                CHAIN_ID
              )
            );
            setDepositStep(DepositStep.DO);
          }}
          selectedAmount={selectedAmount}
          selectedCurrency={selectedCurrency}
          txHash={txHash}
        />
      );
  }
};

export default DesktopDepositPage;
