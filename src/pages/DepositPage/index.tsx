import React from "react";
import MobileDepositPage from "pages/DepositPage/MobileDepositPage";
import DesktopDepositPage from "pages/DepositPage/DesktopDepositPage";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";
import { initialNoteStringCommitment } from "pages/DepositPage/MobileDepositPage";
import { getNoteStringAndCommitment } from "utils/snarks-functions";
import { CHAIN_ID } from "config";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { useDeposit } from "hooks/writeContract";
import { useAsyncState } from "hooks/useAsyncState";
import { PoofKitGlobal } from "hooks/usePoofKit";

export const BLOCKS_PER_WEEK = 120960;

export interface IDepositProps {
  setSelectedAmount: (amount: string) => void;
  selectedAmount: string;
  setSelectedCurrency: (currency: string) => void;
  selectedCurrency: string;
  setNoteStringCommitment: (noteStringCommitment: NoteStringCommitment) => void;
  noteStringCommitment: NoteStringCommitment;
  txHash: string;
  deposit: () => Promise<void>;
  depositLoading: boolean;
  poofRate: string;
  apRate: string;
}

const DepositPage: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = React.useState("0");
  const [selectedCurrency, setSelectedCurrency] = React.useState("CELO");
  const { poofKit } = PoofKitGlobal.useContainer();
  const getMiningRate = React.useCallback(async () => {
    const { poofRate, apRate } = await poofKit.miningRate(
      selectedCurrency,
      selectedAmount,
      CHAIN_ID,
      BLOCKS_PER_WEEK
    );
    return { poofRate, apRate };
  }, [poofKit, selectedCurrency, selectedAmount]);
  const [{ poofRate, apRate }] = useAsyncState(
    { poofRate: "0", apRate: "0" },
    getMiningRate
  );
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
        poofRate={poofRate}
        apRate={apRate}
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
      poofRate={poofRate}
      apRate={apRate}
    />
  );
};

export default DepositPage;
