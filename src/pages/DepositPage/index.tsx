import React from "react";
import MobileDepositPage from "pages/DepositPage/MobileDepositPage";
import DesktopDepositPage from "pages/DepositPage/DesktopDepositPage";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { useDeposit } from "hooks/writeContract";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useDebounce } from "hooks/useDebounce";
import { getNotes } from "utils/notes";
import { useRecoilState } from "recoil";
import {
  depositActualAmount,
  depositAmount,
  depositCurrency,
  depositNotes,
  depositUsingCustom,
} from "pages/DepositPage/state";

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
}

const DepositPage: React.FC = () => {
  const { network } = useContractKit();

  const [amount, setAmount] = useRecoilState(depositAmount);
  const [actualAmount, setActualAmount] = useRecoilState(depositActualAmount);
  const [currency, setCurrency] = useRecoilState(depositCurrency);
  const [usingCustom, setUsingCustom] = useRecoilState(depositUsingCustom);
  const [notes, setNotes] = useRecoilState(depositNotes);

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
    />
  );
};

export default DepositPage;
