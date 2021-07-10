import React from "react";
import { getNoteStringAndCommitment } from "utils/snarks-functions";
import { PickDeposit } from "pages/DepositPage/MobileDepositPage/PickDeposit";
import { ConfirmDeposit } from "pages/DepositPage/MobileDepositPage/ConfirmDeposit";
import { DepositReceipt } from "pages/DepositPage/MobileDepositPage/DepositReceipt";
import { CHAIN_ID } from "config";
import { IDepositProps } from "pages/DepositPage";

enum DepositStep {
  PICKER = "PICKER",
  CONFIRM = "CONFIRM",
  RECEIPT = "RECEIPT",
}

export const initialNoteStringCommitment = {
  noteString: "",
  commitment: "",
};

// pass props and State interface to Component class
const MobileDepositPage: React.FC<IDepositProps> = ({
  setSelectedAmount,
  selectedAmount,
  setSelectedCurrency,
  selectedCurrency,
  setNoteStringCommitment,
  noteStringCommitment,
  txHash,
  deposit,
  depositLoading,
  poofRate,
  apRate,
  backup,
  setBackup,
}) => {
  const [depositStep, setDepositStep] = React.useState(DepositStep.PICKER);

  switch (depositStep) {
    case DepositStep.PICKER:
      return (
        <PickDeposit
          onDepositClick={() => {
            setDepositStep(DepositStep.CONFIRM);
          }}
          selectedAmount={selectedAmount}
          setSelectedAmount={setSelectedAmount}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          poofRate={poofRate}
          apRate={apRate}
        />
      );
    case DepositStep.CONFIRM:
      return (
        <ConfirmDeposit
          onBackClick={() => setDepositStep(DepositStep.PICKER)}
          onConfirmClick={() => {
            deposit()
              .then(() => setDepositStep(DepositStep.RECEIPT))
              .catch((e) => {
                console.error("Failed to deposit", e);
                alert(e);
              });
          }}
          selectedAmount={selectedAmount}
          selectedCurrency={selectedCurrency}
          noteStringCommitment={noteStringCommitment}
          depositLoading={depositLoading}
          backup={backup}
          setBackup={setBackup}
        />
      );
    case DepositStep.RECEIPT:
      return (
        <DepositReceipt
          onDoneClick={() => {
            // Generate a new note
            setNoteStringCommitment(
              getNoteStringAndCommitment(
                selectedCurrency,
                selectedAmount,
                CHAIN_ID
              )
            );
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
