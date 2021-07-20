import React from "react";
import MobileDepositPage from "pages/DepositPage/MobileDepositPage";
import DesktopDepositPage from "pages/DepositPage/DesktopDepositPage";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";
import { getNoteStringAndCommitment, parseNote } from "utils/snarks-functions";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { useDeposit } from "hooks/writeContract";
import { useAsyncState } from "hooks/useAsyncState";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { useContractKit } from "@celo-tools/use-contractkit";
import { deployments } from "@poofcash/poof-kit";

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
  const [currency, setCurrency] = React.useState("CELO");
  const { network } = useContractKit();
  const [notes, setNotes] = React.useState<NoteStringCommitment[]>([]);
  const updateNotes = React.useCallback(
    (amount, currency) => {
      if (Number(amount) === 0) {
        return [];
      }
      const res: NoteStringCommitment[] = [];
      const denominations = Object.keys(
        deployments[`netId${network.chainId}`][currency.toLowerCase()]
          .instanceAddress
      )
        .sort()
        .reverse();
      let tempAmount = Number(amount);
      for (const denomination of denominations) {
        const quantity = Math.floor(Number(tempAmount) / Number(denomination));
        for (let i = 0; i < quantity; i++) {
          res.push(
            getNoteStringAndCommitment(currency, denomination, network.chainId)
          );
        }
        tempAmount -= quantity * Number(denomination);
      }
      setNotes(res);
    },
    [network]
  );
  const { poofKit } = PoofKitGlobal.useContainer();
  const getMiningRate = React.useCallback(async () => {
    let totalPoofRate = 0;
    let totalApRate = 0;
    const memo: Record<string, { poofRate: string; apRate: string }> = {};
    for (const note of notes) {
      const { currency, amount, netId } = parseNote(note.noteString);
      if (memo[`${currency}${amount}${netId}`]) {
        const { poofRate, apRate } = memo[`${currency}${amount}${netId}`];
        totalPoofRate += Number(poofRate);
        totalApRate += Number(apRate);
      } else {
        const { poofRate, apRate } = await poofKit.miningRate(
          currency,
          amount,
          netId?.toString() ?? "",
          BLOCKS_PER_WEEK
        );
        memo[`${currency}${amount}${netId}`] = { poofRate, apRate };
        totalPoofRate += Number(poofRate);
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
