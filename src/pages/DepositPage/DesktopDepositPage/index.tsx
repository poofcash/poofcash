import React from "react";
import { getNoteStringAndCommitment } from "utils/snarks-functions";
import { CHAIN_ID } from "config";
import { DoDeposit } from "pages/DepositPage/DesktopDepositPage/DoDeposit";
import { DepositReceipt } from "pages/DepositPage/DesktopDepositPage/DepositReceipt";
import { IDepositProps } from "pages/DepositPage";

enum DepositStep {
  DO = "DO",
  RECEIPT = "RECEIPT",
}

const DesktopDepositPage: React.FC<IDepositProps> = ({
  setSelectedAmount,
  selectedAmount,
  setSelectedCurrency,
  selectedCurrency,
  setNoteStringCommitment,
  noteStringCommitment,
  txHash,
  deposit,
  depositLoading,
  miningRate,
}) => {
  const [depositStep, setDepositStep] = React.useState(DepositStep.DO);

  switch (depositStep) {
    case DepositStep.DO:
      return (
        <DoDeposit
          onDepositClick={() => {
            deposit()
              .then(() => setDepositStep(DepositStep.RECEIPT))
              .catch((e) => {
                console.error("Failed to deposit", e);
                alert(e);
              });
          }}
          selectedAmount={selectedAmount}
          setSelectedAmount={setSelectedAmount}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          noteStringCommitment={noteStringCommitment}
          depositLoading={depositLoading}
          miningRate={miningRate}
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
