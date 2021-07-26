import React from "react";
import MobileDepositPage from "pages/DepositPage/MobileDepositPage";
import DesktopDepositPage from "pages/DepositPage/DesktopDepositPage";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";
import { parseNote } from "utils/snarks-functions";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { useDeposit } from "hooks/writeContract";
import { useAsyncState } from "hooks/useAsyncState";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useDebounce } from "hooks/useDebounce";
import { getNotes } from "utils/notes";
import { fromWei } from "web3-utils";
import { useRecoilState } from "recoil";
import {
  depositActualAmount,
  depositAmount,
  depositBackup,
  depositCurrency,
  depositNotes,
  depositUsingCustom,
} from "pages/DepositPage/state";

export const BLOCKS_PER_WEEK = 120960;

export interface IDepositProps {
  setAmount: (amount: string) => void;
  amount: string;
  setCurrency: (currency: string) => void;
  currency: string;
  notes: NoteStringCommitment[];
  resetNotes: () => void;
  setUsingCustom: (usingCustom: boolean) => void;
  usingCustom: boolean;
  actualAmount: string;
  txHash: string;
  deposit: (privateKey?: string) => Promise<void>;
  depositLoading: boolean;
  poofRate: string;
  apRate: string;
  backup: boolean;
  setBackup: (backup: boolean) => void;
}

const DepositPage: React.FC = () => {
  const { network } = useContractKit();

  const [amount, setAmount] = useRecoilState(depositAmount);
  const [actualAmount, setActualAmount] = useRecoilState(depositActualAmount);
  const [currency, setCurrency] = useRecoilState(depositCurrency);
  const [usingCustom, setUsingCustom] = useRecoilState(depositUsingCustom);
  const [notes, setNotes] = useRecoilState(depositNotes);
  const [backup, setBackup] = useRecoilState(depositBackup);

  const updateNotesCall = React.useCallback(
    (amount, currency) => {
      const { notes, amount: actualAmount } = getNotes(
        amount,
        currency,
        network.chainId
      );
      setNotes(notes);
      setActualAmount(actualAmount.toString());
    },
    [network, setNotes, setActualAmount]
  );
  const updateNotes = useDebounce(updateNotesCall, 1000);
  const { poofKit } = PoofKitGlobal.useContainer();
  const getMiningRate = React.useCallback(async () => {
    let totalPoofRate = 0;
    let totalApRate = 0;
    const memo: Record<string, { poofRate: string; apRate: string }> = {};
    for (const note of notes) {
      const { currency, amount, netId } = parseNote(note.noteString);
      if (memo[`${currency}${amount}${netId}`]) {
        const { poofRate, apRate } = memo[`${currency}${amount}${netId}`];
        totalPoofRate += Number(fromWei(poofRate));
        totalApRate += Number(apRate);
      } else {
        const { poofRate, apRate } = await poofKit.miningRate(
          currency,
          amount,
          netId?.toString() ?? "",
          BLOCKS_PER_WEEK
        );
        memo[`${currency}${amount}${netId}`] = { poofRate, apRate };
        totalPoofRate += Number(fromWei(poofRate));
        totalApRate += Number(apRate);
      }
    }
    return {
      poofRate: totalPoofRate.toString(),
      apRate: totalApRate.toString(),
    };
  }, [notes, poofKit]);
  const [{ poofRate, apRate }] = useAsyncState(
    { poofRate: "0", apRate: "0" },
    getMiningRate
  );

  const breakpoint = useBreakpoint();

  const onCurrencyChange = (currency: string) => {
    // Reset the selected amount
    setCurrency(currency);
    setAmount("0");
    setNotes([]);
  };
  const [txHash, deposit, depositLoading] = useDeposit(
    notes.map((note) => note.noteString)
  );

  if (breakpoint === Breakpoint.MOBILE) {
    return (
      <MobileDepositPage
        setAmount={(amount) => {
          setAmount(amount);
          updateNotes(amount, currency);
        }}
        amount={amount}
        setCurrency={onCurrencyChange}
        currency={currency}
        notes={notes}
        resetNotes={() => updateNotes(amount, currency)}
        setUsingCustom={setUsingCustom}
        usingCustom={usingCustom}
        actualAmount={actualAmount}
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
      setAmount={(amount) => {
        setAmount(amount);
        updateNotes(amount, currency);
      }}
      amount={amount}
      setCurrency={onCurrencyChange}
      currency={currency}
      notes={notes}
      resetNotes={() => updateNotes(amount, currency)}
      setUsingCustom={(custom) => {
        setAmount("0");
        setNotes([]);
        setUsingCustom(custom);
      }}
      usingCustom={usingCustom}
      actualAmount={actualAmount}
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
