import React from "react";
import MobileDepositPage from "pages/DepositPage/MobileDepositPage";
import DesktopDepositPage from "pages/DepositPage/DesktopDepositPage";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";
import { initialNoteStringCommitment } from "pages/DepositPage/MobileDepositPage";
import { getNoteStringAndCommitment } from "utils/snarks-functions";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { useDeposit } from "hooks/writeContract";
import { useAsyncState } from "hooks/useAsyncState";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { useContractKit } from "@celo-tools/use-contractkit";

export const BLOCKS_PER_WEEK = 120960;

export interface IDepositProps {
  setSelectedAmount: (amount: string) => void;
  selectedAmount: string;
  setSelectedCurrency: (currency: string) => void;
  selectedCurrency: string;
  setNoteStringCommitment: (noteStringCommitment: NoteStringCommitment) => void;
  noteStringCommitment: NoteStringCommitment;
  txHash: string;
  deposit: (privateKey?: string) => Promise<void>;
  depositLoading: boolean;
  poofRate: string;
  apRate: string;
  backup: boolean;
  setBackup: (backup: boolean) => void;
}

const DepositPage: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = React.useState("0");
  const [selectedCurrency, setSelectedCurrency] = React.useState("CELO");
  const { network } = useContractKit();
  const { poofKit } = PoofKitGlobal.useContainer();
  const getMiningRate = React.useCallback(async () => {
    const { poofRate, apRate } = await poofKit.miningRate(
      selectedCurrency,
      selectedAmount,
      network.chainId,
      BLOCKS_PER_WEEK
    );
    return { poofRate, apRate };
  }, [poofKit, selectedCurrency, selectedAmount, network]);
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
      getNoteStringAndCommitment(
        selectedCurrency,
        selectedAmount,
        network.chainId
      )
    );
  }, [selectedCurrency, selectedAmount, network]);

  const breakpoint = useBreakpoint();

  const onCurrencyChange = (currency: string) => {
    // Reset the selected amount
    setSelectedCurrency(currency);
    setSelectedAmount("0");
  };
  const [txHash, deposit, depositLoading] = useDeposit(
    noteStringCommitment.noteString
  );
  const { poofAccount } = PoofAccountGlobal.useContainer();
  const [backup, setBackup] = React.useState<boolean>(
    poofAccount !== undefined
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
        backup={backup}
        setBackup={setBackup}
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
      backup={backup}
      setBackup={setBackup}
    />
  );
};

export default DepositPage;
