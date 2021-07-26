import React from "react";
import MobileMinePage from "pages/MinePage/MobileMinePage";
import DesktopMinePage from "pages/MinePage/DesktopMinePage";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";
import { isValidNote, parseNote } from "utils/snarks-functions";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { useLatestBlockNumber } from "hooks/web3";
import { RelayerOption, useRelayer } from "hooks/useRelayer";
import { useAsyncState } from "hooks/useAsyncState";
import { usePoofEvents } from "hooks/usePoofEvents";
import { deployments, Note } from "@poofcash/poof-kit";
import { useMiningRates } from "hooks/useMiningRates";

export interface IMineProps {
  setNote: (note: string) => void;
  note: string;
  noteIsValid: boolean;
  estimatedAp: number;
  setTxHash: (txHash: string) => void;
  txHash: string;
  selectedRelayer?: RelayerOption;
  setSelectedRelayer: (relayer?: RelayerOption) => void;
  relayerOptions?: Array<RelayerOption>;
  usingCustomRelayer: boolean;
  setUsingCustomRelayer: (usingCustomRelayer: boolean) => void;
  customRelayer?: RelayerOption;
  setCustomRelayer: (relayerOption?: RelayerOption) => void;
  relayerFee: string;
}

const MinePage: React.FC = () => {
  const [note, setNote] = React.useState("");
  const noteIsValid = React.useMemo(() => isValidNote(note), [note]);
  const [depositEvents] = usePoofEvents("Deposit");
  const [withdrawEvents] = usePoofEvents("Withdrawal");
  // TODO: Reduce forno calls
  const [miningRates] = useMiningRates();
  const { poofKit } = PoofKitGlobal.useContainer();

  // Calculate estimated AP
  const [latestBlockNumber] = useLatestBlockNumber();
  let estimatedAp = 0;
  if (isValidNote(note)) {
    const { netId, currency, amount } = parseNote(note);
    const poofAddress =
      deployments[`netId${netId}`][currency].instanceAddress[amount];

    const noteObject = Note.fromString(
      note,
      depositEvents[poofAddress],
      withdrawEvents[poofAddress]
    );
    const withdrawBlock =
      noteObject.withdrawalBlock?.blockNumber ?? latestBlockNumber;
    const blocksElapsed = Math.max(
      withdrawBlock - noteObject.depositBlock.blockNumber,
      0
    );
    estimatedAp = blocksElapsed * Number(miningRates[poofAddress].toString());
  }
  const [txHash, setTxHash] = React.useState("");
  const {
    relayer,
    setSelectedRelayer,
    relayerOptions,
    usingCustomRelayer,
    setUsingCustomRelayer,
    customRelayer,
    setCustomRelayer,
  } = useRelayer();
  const getRelayerFee = React.useCallback(async () => {
    if (relayer) {
      return await poofKit.rewardFee(
        relayer.gasPrices["min"] || 0.5,
        relayer.celoPrices["poof"]
      );
    }
    return "0";
  }, [poofKit, relayer]);
  const [relayerFee] = useAsyncState("0", getRelayerFee);
  const breakpoint = useBreakpoint();

  if (breakpoint === Breakpoint.MOBILE) {
    return (
      <MobileMinePage
        setNote={setNote}
        note={note}
        noteIsValid={noteIsValid}
        estimatedAp={estimatedAp}
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
    <DesktopMinePage
      setNote={setNote}
      note={note}
      noteIsValid={noteIsValid}
      estimatedAp={estimatedAp}
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

export default MinePage;
