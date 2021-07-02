import React from "react";
import MobileRedeemPage from "pages/RedeemPage/MobileRedeemPage";
import DesktopRedeemPage from "pages/RedeemPage/DesktopRedeemPage";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";
import { PoofKitGlobal, usePoofAmount } from "hooks/poofUtils";
import { RelayerOption, useRelayer } from "hooks/useRelayer";
import { useAsyncState } from "hooks/useAsyncState";

export interface IRedeemProps {
  setAmount: (amount: string) => void;
  amount: string;
  poofAmount: string;
  setRecipient: (recipient: string) => void;
  recipient: string;
  setMaxRedeemAmount: (amount: string) => void;
  maxRedeemAmount?: string;
  setTxHash: (txHash: string) => void;
  txHash: string;
  selectedRelayer?: RelayerOption;
  setSelectedRelayer: (selectedRelayer?: RelayerOption) => void;
  relayerOptions?: Array<RelayerOption>;
  usingCustomRelayer: boolean;
  setUsingCustomRelayer: (usingCustomRelayer: boolean) => void;
  customRelayer?: RelayerOption;
  setCustomRelayer: (relayerOption?: RelayerOption) => void;
  relayerFee: string;
}

const RedeemPage: React.FC = () => {
  const [amount, setAmount] = React.useState("0");
  const poofAmount = usePoofAmount(amount);
  const [recipient, setRecipient] = React.useState("");
  const [txHash, setTxHash] = React.useState("");
  const [maxRedeemAmount, setMaxRedeemAmount] = React.useState<
    string | undefined
  >();
  const {
    relayer,
    setSelectedRelayer,
    relayerOptions,
    usingCustomRelayer,
    setUsingCustomRelayer,
    customRelayer,
    setCustomRelayer,
  } = useRelayer();
  const { poofKit } = PoofKitGlobal.useContainer();
  const getRelayerFee = React.useCallback(async () => {
    if (relayer) {
      return await poofKit.swapFee(
        relayer.gasPrices["min"] || 0.5,
        relayer.celoPrices["poof"],
        relayer.miningServiceFee,
        amount
      );
    }
    return "0";
  }, [poofKit, relayer, amount]);
  const [relayerFee] = useAsyncState("0", getRelayerFee);
  const breakpoint = useBreakpoint();

  if (breakpoint === Breakpoint.MOBILE) {
    return (
      <MobileRedeemPage
        setAmount={setAmount}
        amount={amount}
        poofAmount={poofAmount}
        setRecipient={setRecipient}
        recipient={recipient}
        setMaxRedeemAmount={setMaxRedeemAmount}
        maxRedeemAmount={maxRedeemAmount}
        setTxHash={setTxHash}
        txHash={txHash}
        selectedRelayer={relayer}
        setSelectedRelayer={setSelectedRelayer}
        relayerOptions={relayerOptions}
        usingCustomRelayer={usingCustomRelayer}
        setUsingCustomRelayer={setUsingCustomRelayer}
        customRelayer={customRelayer}
        setCustomRelayer={setCustomRelayer}
        relayerFee={relayerFee}
      />
    );
  }

  return (
    <DesktopRedeemPage
      setAmount={setAmount}
      amount={amount}
      poofAmount={poofAmount}
      setRecipient={setRecipient}
      recipient={recipient}
      setMaxRedeemAmount={setMaxRedeemAmount}
      maxRedeemAmount={maxRedeemAmount}
      setTxHash={setTxHash}
      txHash={txHash}
      selectedRelayer={relayer}
      setSelectedRelayer={setSelectedRelayer}
      relayerOptions={relayerOptions}
      usingCustomRelayer={usingCustomRelayer}
      setUsingCustomRelayer={setUsingCustomRelayer}
      customRelayer={customRelayer}
      setCustomRelayer={setCustomRelayer}
      relayerFee={relayerFee}
    />
  );
};

export default RedeemPage;
