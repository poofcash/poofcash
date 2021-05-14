import React from "react";
import axios from "axios";
import { PickWithdraw } from "pages/WithdrawPage/MobileWithdrawPage/PickWithdraw";
import { ConfirmWithdraw } from "pages/WithdrawPage/MobileWithdrawPage/ConfirmWithdraw";
import { WithdrawReceipt } from "pages/WithdrawPage/MobileWithdrawPage/WithdrawReceipt";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";
import { NETWORK, RELAYERS } from "config";

enum WithdrawStep {
  PICKER = "PICKER",
  CONFIRM = "CONFIRM",
  RECEIPT = "RECEIPT",
}

const WithdrawPage = () => {
  const [withdrawStep, setWithdrawStep] = React.useState(WithdrawStep.PICKER);
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

  const relayer = usingCustomRelayer ? customRelayer : selectedRelayer;

  switch (withdrawStep) {
    case WithdrawStep.PICKER:
      return (
        <PickWithdraw
          onWithdrawClick={() => {
            setWithdrawStep(WithdrawStep.CONFIRM);
          }}
          setNote={setNote}
          note={note}
          setRecipient={setRecipient}
          recipient={recipient}
          selectedRelayer={selectedRelayer}
          setSelectedRelayer={setSelectedRelayer}
          relayerOptions={relayerOptions}
          usingCustomRelayer={usingCustomRelayer}
          setUsingCustomRelayer={setUsingCustomRelayer}
          customRelayer={customRelayer}
          setCustomRelayer={setCustomRelayer}
        />
      );
    case WithdrawStep.CONFIRM:
      return (
        <ConfirmWithdraw
          onBackClick={() => setWithdrawStep(WithdrawStep.PICKER)}
          onConfirmClick={() => setWithdrawStep(WithdrawStep.RECEIPT)}
          note={note}
          recipient={recipient}
          setTxHash={setTxHash}
          selectedRelayer={relayer!}
        />
      );
    case WithdrawStep.RECEIPT:
      return (
        <WithdrawReceipt
          onDoneClick={() => {
            setWithdrawStep(WithdrawStep.PICKER);
            setNote("");
            setRecipient("");
          }}
          note={note}
          txHash={txHash}
          poofServiceFee={relayer!.relayerFee}
          recipient={recipient}
        />
      );
  }
};

export default WithdrawPage;
