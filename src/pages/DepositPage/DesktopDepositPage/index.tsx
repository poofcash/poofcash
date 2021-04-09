import React from "react";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { getNoteStringAndCommitment } from "utils/snarks-functions";
import { CHAIN_ID } from "config";
import { initialNoteStringCommitment } from "pages/DepositPage/MobileDepositPage";
import { DepositState, useDepositCallback } from "hooks/writeContract";
import { DoDeposit } from "pages/DepositPage/DesktopDepositPage/DoDeposit";
import { DepositReceipt } from "pages/DepositPage/DesktopDepositPage/DepositReceipt";

enum DepositStep {
  DO = "DO",
  RECEIPT = "RECEIPT",
}

const DesktopDepositPage: React.FC = () => {
  const [depositStep, setDepositStep] = React.useState(DepositStep.DO);

  const [selectedAmount, setSelectedAmount] = React.useState("");
  const [selectedCurrency, setSelectedCurrency] = React.useState("celo");
  const [
    noteStringCommitment,
    setNoteStringCommitment,
  ] = React.useState<NoteStringCommitment>(initialNoteStringCommitment);

  React.useEffect(() => {
    setNoteStringCommitment(
      getNoteStringAndCommitment(selectedCurrency, selectedAmount, CHAIN_ID)
    );
  }, [selectedCurrency, selectedAmount]);

  const [depositState, txHash, depositCallback] = useDepositCallback(
    Number(selectedAmount),
    noteStringCommitment.commitment
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
