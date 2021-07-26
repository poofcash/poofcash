import React from "react";
import MobileWithdrawPage from "pages/WithdrawPage/MobileWithdrawPage";
import DesktopWithdrawPage from "pages/WithdrawPage/DesktopWithdrawPage";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";
import { RelayerOption, useRelayer } from "hooks/useRelayer";
import { calculateFee, deployments, parseNote } from "@poofcash/poof-kit";
import { isValidNote } from "utils/snarks-functions";
import { fromWei } from "web3-utils";
import { useRecoilState } from "recoil";
import {
  withdrawNote,
  withdrawRecipient,
  withdrawTxHash,
} from "pages/WithdrawPage/state";

export interface IWithdrawProps {
  setNote: (note: string) => void;
  note: string;
  setRecipient: (recipient: string) => void;
  recipient: string;
  setTxHash: (txHash: string) => void;
  selectedRelayer?: RelayerOption;
  setSelectedRelayer: (relayer?: RelayerOption) => void;
  relayerOptions?: Array<RelayerOption>;
  usingCustomRelayer: boolean;
  setUsingCustomRelayer: (usingCustomRelayer: boolean) => void;
  customRelayer?: RelayerOption;
  setCustomRelayer: (relayerOption?: RelayerOption) => void;
  txHash: string;
  relayerFee: string;
}

const WithdrawPage: React.FC = () => {
  const [note, setNote] = useRecoilState(withdrawNote);
  const [recipient, setRecipient] = useRecoilState(withdrawRecipient);
  const [txHash, setTxHash] = useRecoilState(withdrawTxHash);
  const breakpoint = useBreakpoint();
  const {
    relayer,
    setSelectedRelayer,
    relayerOptions,
    usingCustomRelayer,
    setUsingCustomRelayer,
    customRelayer,
    setCustomRelayer,
  } = useRelayer();

  const { currency, amount, netId } = parseNote(note);
  let relayerFee = "0";
  if (isValidNote(note) && relayer && amount && currency) {
    relayerFee = fromWei(
      calculateFee(
        relayer.gasPrices["min"] || 0.5,
        amount,
        "0",
        relayer.celoPrices[currency.toLowerCase()],
        relayer.relayerFee,
        deployments[`netId${netId}`][currency.toLowerCase()].decimals,
        5e5
      )
    );
  }

  if (breakpoint === Breakpoint.MOBILE) {
    return (
      <MobileWithdrawPage
        setNote={setNote}
        note={note}
        setRecipient={setRecipient}
        recipient={recipient}
        selectedRelayer={relayer}
        setSelectedRelayer={setSelectedRelayer}
        relayerOptions={relayerOptions}
        usingCustomRelayer={usingCustomRelayer}
        setUsingCustomRelayer={setUsingCustomRelayer}
        customRelayer={customRelayer}
        setCustomRelayer={setCustomRelayer}
        setTxHash={setTxHash}
        txHash={txHash}
        relayerFee={relayerFee}
      />
    );
  }

  return (
    <DesktopWithdrawPage
      setNote={setNote}
      note={note}
      setRecipient={setRecipient}
      recipient={recipient}
      selectedRelayer={relayer}
      setSelectedRelayer={setSelectedRelayer}
      relayerOptions={relayerOptions}
      usingCustomRelayer={usingCustomRelayer}
      setUsingCustomRelayer={setUsingCustomRelayer}
      customRelayer={customRelayer}
      setCustomRelayer={setCustomRelayer}
      setTxHash={setTxHash}
      txHash={txHash}
      relayerFee={relayerFee}
    />
  );
};

export default WithdrawPage;
