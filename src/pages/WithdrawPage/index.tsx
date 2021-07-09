import React from "react";
import MobileWithdrawPage from "pages/WithdrawPage/MobileWithdrawPage";
import DesktopWithdrawPage from "pages/WithdrawPage/DesktopWithdrawPage";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";
import { RelayerOption, useRelayer } from "hooks/useRelayer";
import { calculateFee, deployments, parseNote } from "@poofcash/poof-kit";
import { isValidNote } from "utils/snarks-functions";
import { fromWei } from "web3-utils";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { PoofKitLoading } from "components/PoofKitLoading";

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
  const [note, setNote] = React.useState("");
  const [recipient, setRecipient] = React.useState("");
  const [txHash, setTxHash] = React.useState("");
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
  const { poofKit } = PoofKitGlobal.useContainer();
  const [initialized, setInitialized] = React.useState(false);
  React.useEffect(() => {
    poofKit
      .initializeSend()
      .then(() => setInitialized(true))
      .catch(console.warn);
  });

  if (!initialized) {
    return <PoofKitLoading />;
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
