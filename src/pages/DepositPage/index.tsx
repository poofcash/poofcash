import React from "react";
import MobileDepositPage from "pages/DepositPage/MobileDepositPage";
import DesktopDepositPage from "pages/DepositPage/DesktopDepositPage";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";
import { parseNote } from "utils/snarks-functions";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { useDeposit } from "hooks/writeContract";
import { useAsyncState } from "hooks/useAsyncState";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useDebounce } from "hooks/useDebounce";
import { getNotes } from "utils/notes";
import { fromWei } from "web3-utils";

export const BLOCKS_PER_WEEK = 120960;

export interface IDepositProps {
  setSelectedAmount: (amount: string) => void;
  selectedAmount: string;
  setSelectedCurrency: (currency: string) => void;
  selectedCurrency: string;
  notes: NoteStringCommitment[];
  resetNotes: () => void;
  setUsingCustom: (usingCustom: boolean) => void;
  usingCustom: boolean;
  setCustomAmount: (amount: string) => void;
  customAmount: string;
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
  const [usingCustom, setUsingCustom] = React.useState(false);
  const [customAmount, setCustomAmount] = React.useState("0");
  const [amount, setAmount] = React.useState("0");
  const [actualAmount, setActualAmount] = React.useState("0");
  const [currency, setCurrency] = React.useState("CELO");
  const { network } = useContractKit();
  const [notes, setNotes] = React.useState<NoteStringCommitment[]>([]);
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
    [network]
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
    setCustomAmount("0");
    setNotes([]);
  };
  const [txHash, deposit, depositLoading] = useDeposit(
    notes.map((note) => note.noteString)
  );
  const { poofAccount } = PoofAccountGlobal.useContainer();
  const [backup, setBackup] = React.useState<boolean>(
    poofAccount !== undefined
  );

  if (breakpoint === Breakpoint.MOBILE) {
    return (
      <MobileDepositPage
        setSelectedAmount={(amount) => {
          setAmount(amount);
          setActualAmount(amount);
          updateNotes(amount, currency);
        }}
        selectedAmount={amount}
        setSelectedCurrency={onCurrencyChange}
        selectedCurrency={currency}
        notes={notes}
        resetNotes={() =>
          updateNotes(usingCustom ? customAmount : amount, currency)
        }
        setUsingCustom={setUsingCustom}
        usingCustom={usingCustom}
        setCustomAmount={(customAmount) => {
          setCustomAmount(customAmount);
          updateNotes(customAmount, currency);
        }}
        customAmount={customAmount}
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
      setSelectedAmount={(amount) => {
        setAmount(amount);
        setActualAmount(amount);
        updateNotes(amount, currency);
      }}
      selectedAmount={amount}
      setSelectedCurrency={onCurrencyChange}
      selectedCurrency={currency}
      notes={notes}
      resetNotes={() =>
        updateNotes(usingCustom ? customAmount : amount, currency)
      }
      setUsingCustom={(custom) => {
        setAmount("0");
        setCustomAmount("0");
        setNotes([]);
        setUsingCustom(custom);
      }}
      usingCustom={usingCustom}
      setCustomAmount={(customAmount) => {
        setCustomAmount(customAmount);
        updateNotes(customAmount, currency);
      }}
      customAmount={customAmount}
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
