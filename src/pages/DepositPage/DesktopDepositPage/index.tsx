import React from "react";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { getNoteStringAndCommitment } from "utils/snarks-functions";
import { CHAIN_ID } from "config";
import { DoDeposit } from "pages/DepositPage/DesktopDepositPage/DoDeposit";
import { DepositReceipt } from "pages/DepositPage/DesktopDepositPage/DepositReceipt";

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
  txHash: string;
  deposit: () => Promise<void>;
  depositLoading: boolean;
}

const DesktopDepositPage: React.FC<IProps> = ({
  setSelectedAmount,
  selectedAmount,
  setSelectedCurrency,
  selectedCurrency,
  setNoteStringCommitment,
  noteStringCommitment,
  txHash,
  deposit,
  depositLoading,
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
