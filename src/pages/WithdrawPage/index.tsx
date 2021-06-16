import React from "react";
import MobileWithdrawPage from "pages/WithdrawPage/MobileWithdrawPage";
import DesktopWithdrawPage, {
  RelayerOption,
} from "pages/WithdrawPage/DesktopWithdrawPage";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";
import { NETWORK, RELAYERS } from "config";
import axios from "axios";

const WithdrawPage: React.FC = () => {
  const [note, setNote] = React.useState("");
  const [recipient, setRecipient] = React.useState("");
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
    />
  );
};

export default WithdrawPage;
