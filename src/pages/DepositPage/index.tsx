import React from "react";
import MobileDepositPage from "pages/DepositPage/MobileDepositPage";
import DesktopDepositPage from "pages/DepositPage/DesktopDepositPage";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";
import { initialNoteStringCommitment } from "pages/DepositPage/MobileDepositPage";
import { getNoteStringAndCommitment } from "utils/snarks-functions";
import { CHAIN_ID } from "config";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { useDeposit } from "hooks/writeContract";

const DepositPage: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = React.useState("0");
  const [selectedCurrency, setSelectedCurrency] = React.useState("CELO");
  const [
    noteStringCommitment,
    setNoteStringCommitment,
  ] = React.useState<NoteStringCommitment>(initialNoteStringCommitment);

  React.useEffect(() => {
    setNoteStringCommitment(
      getNoteStringAndCommitment(selectedCurrency, selectedAmount, CHAIN_ID)
    );
  }, [selectedCurrency, selectedAmount]);

  const breakpoint = useBreakpoint();

  const onCurrencyChange = (currency: string) => {
    // Reset the selected amount
    setSelectedCurrency(currency);
    setSelectedAmount("0");
  };
  const [txHash, deposit, depositLoading] = useDeposit(
    noteStringCommitment.noteString
  );

  if (breakpoint === Breakpoint.MOBILE) {
    return (
      <MobileDepositPage
        setSelectedAmount={setSelectedAmount}
        selectedAmount={selectedAmount}
        setSelectedCurrency={onCurrencyChange}
        selectedCurrency={selectedCurrency}
        setNoteStringCommitment={setNoteStringCommitment}
        noteStringCommitment={noteStringCommitment}
        txHash={txHash}
        deposit={deposit}
        depositLoading={depositLoading}
      />
    );
  }

  return (
    <DesktopDepositPage
      setSelectedAmount={setSelectedAmount}
      selectedAmount={selectedAmount}
      setSelectedCurrency={onCurrencyChange}
      selectedCurrency={selectedCurrency}
      setNoteStringCommitment={setNoteStringCommitment}
      noteStringCommitment={noteStringCommitment}
      txHash={txHash}
      deposit={deposit}
      depositLoading={depositLoading}
    />
  );
};

export default DepositPage;
