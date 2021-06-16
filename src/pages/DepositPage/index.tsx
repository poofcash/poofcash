import React from "react";
import MobileDepositPage from "pages/DepositPage/MobileDepositPage";
import DesktopDepositPage from "pages/DepositPage/DesktopDepositPage";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";
import { initialNoteStringCommitment } from "pages/DepositPage/MobileDepositPage";
import { getNoteStringAndCommitment } from "utils/snarks-functions";
import { CHAIN_ID } from "config";
import { NoteStringCommitment } from "pages/DepositPage/types";

const DepositPage: React.FC = () => {
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

  const breakpoint = useBreakpoint();

  if (breakpoint === Breakpoint.MOBILE) {
    return (
      <MobileDepositPage
        setSelectedAmount={setSelectedAmount}
        selectedAmount={selectedAmount}
        setSelectedCurrency={setSelectedCurrency}
        selectedCurrency={selectedCurrency}
        setNoteStringCommitment={setNoteStringCommitment}
        noteStringCommitment={noteStringCommitment}
      />
    );
  }

  return (
    <DesktopDepositPage
      setSelectedAmount={setSelectedAmount}
      selectedAmount={selectedAmount}
      setSelectedCurrency={setSelectedCurrency}
      selectedCurrency={selectedCurrency}
      setNoteStringCommitment={setNoteStringCommitment}
      noteStringCommitment={noteStringCommitment}
    />
  );
};

export default DepositPage;
