import React from "react";
import MobileMinePage from "pages/MinePage/MobileMinePage";
import DesktopMinePage from "pages/MinePage/DesktopMinePage";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";
import { NETWORK, RELAYERS } from "config";
import axios from "axios";
import { NoteInfo } from "@poofcash/poof-kit";
import { isValidNote } from "utils/snarks-functions";
import { PoofKitGlobal } from "hooks/poofUtils";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";
import { useLatestBlockNumber } from "hooks/web3";

const MinePage: React.FC = () => {
  const [note, setNote] = React.useState("");
  const noteIsValid = React.useMemo(() => isValidNote(note), [note]);
  const [noteInfo, setNoteInfo] = React.useState<NoteInfo>();
  const { poofKit } = PoofKitGlobal.useContainer();
  React.useEffect(() => {
    if (noteIsValid) {
      poofKit.noteInfo(note).then(setNoteInfo);
    }
  }, [noteIsValid, note, poofKit]);

  // Calculate estimated AP
  const latestBlockNumber = useLatestBlockNumber();
  let estimatedAp = 0;
  if (isValidNote(note) && noteInfo && noteInfo.depositBlock) {
    const withdrawBlock =
      noteInfo.withdrawBlock?.blockNumber ?? latestBlockNumber;
    const blocksElapsed = Math.max(
      withdrawBlock - noteInfo.depositBlock.blockNumber,
      0
    );
    estimatedAp = blocksElapsed * noteInfo.rate;
  }

  const [selectedRelayer, setSelectedRelayer] = React.useState<RelayerOption>();
  const [relayerOptions, setRelayerOptions] = React.useState<
    Array<RelayerOption>
  >([]);
  const [customRelayer, setCustomRelayer] = React.useState<RelayerOption>();
  const [usingCustomRelayer, setUsingCustomRelayer] = React.useState<boolean>(
    false
  );
  const [txHash, setTxHash] = React.useState("");

  React.useEffect(() => {
    const fn = async () => {
      const statuses = (
        await Promise.all(
          RELAYERS[NETWORK].map((relayerUrl: string) => {
            return axios.get(relayerUrl + "/status").catch((e) => e);
          })
        )
      ).filter((result) => {
        if (result instanceof Error) {
          console.error(result);
          return false;
        }
        return true;
      });

      const relayerOptions = statuses.map((status) => ({
        url: status.config.url.split("/status")[0],
        relayerFee: status.data.poofServiceFee,
      }));

      setRelayerOptions(relayerOptions);
      if (relayerOptions.length > 0) {
        setSelectedRelayer(relayerOptions[0]);
      } else {
        setUsingCustomRelayer(true);
      }
    };
    fn();
  }, [setRelayerOptions, setSelectedRelayer]);

  const relayer = React.useMemo(
    () => (usingCustomRelayer ? customRelayer : selectedRelayer),
    [customRelayer, selectedRelayer, usingCustomRelayer]
  );

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
    />
  );
};

export default MinePage;
