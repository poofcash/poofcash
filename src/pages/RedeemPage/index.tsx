import React from "react";
import MobileRedeemPage from "pages/RedeemPage/MobileRedeemPage";
import DesktopRedeemPage from "pages/RedeemPage/DesktopRedeemPage";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";
import { usePoofAmount } from "hooks/poofUtils";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";
import { NETWORK, RELAYERS } from "config";
import axios from "axios";

const RedeemPage: React.FC = () => {
  const [amount, setAmount] = React.useState("");
  const poofAmount = usePoofAmount(amount);
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
  const [maxRedeemAmount, setMaxRedeemAmount] = React.useState<
    string | undefined
  >();

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
    />
  );
};

export default RedeemPage;
