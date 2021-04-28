import React from "react";
import { NETWORK, RELAYERS } from "config";
import { DoWithdraw } from "pages/WithdrawPage/DesktopWithdrawPage/DoWithdraw";
import { WithdrawReceipt } from "pages/WithdrawPage/DesktopWithdrawPage/WithdrawReceipt";
import axios from "axios";

enum WithdrawStep {
  DO = "DO",
  RECEIPT = "RECEIPT",
}

export type RelayerOption = {
  url: string;
  relayerFee: number;
};

const DesktopWithdrawPage: React.FC = () => {
  const [depositStep, setWithdrawStep] = React.useState(WithdrawStep.DO);
  const [note, setNote] = React.useState("");
  const [recipient, setRecipient] = React.useState("");
  const [selectedRelayer, setSelectedRelayer] = React.useState<RelayerOption>();
  const [relayerOptions, setRelayerOptions] = React.useState<
    Array<RelayerOption> | undefined
  >(undefined);
  const [customRelayer, setCustomRelayer] = React.useState<RelayerOption>();
  const [usingCustomRelayer, setUsingCustomRelayer] = React.useState<boolean>(
    false
  );
  const [txHash, setTxHash] = React.useState("");

  React.useEffect(() => {
    const fn = async () => {
      const statuses = await Promise.all(
        RELAYERS[NETWORK].map((relayerUrl: string) => {
          return axios.get(relayerUrl + "/status");
        })
      );

      const relayerOptions = RELAYERS[NETWORK].map(
        (relayerUrl: string, i: number) => ({
          url: relayerUrl,
          relayerFee: statuses[i].data.poofServiceFee,
        })
      );

      setRelayerOptions(relayerOptions);
      setSelectedRelayer(relayerOptions[0]);
    };
    fn();
  }, [setRelayerOptions, setSelectedRelayer]);

  const relayer = usingCustomRelayer ? customRelayer : selectedRelayer;

  switch (depositStep) {
    case WithdrawStep.DO:
      return (
        <DoWithdraw
          onWithdrawClick={() => {
            setWithdrawStep(WithdrawStep.RECEIPT);
          }}
          setNote={setNote}
          note={note}
          setRecipient={setRecipient}
          recipient={recipient}
          setTxHash={setTxHash}
          selectedRelayer={relayer}
          setSelectedRelayer={setSelectedRelayer}
          relayerOptions={relayerOptions}
          usingCustomRelayer={usingCustomRelayer}
          setUsingCustomRelayer={setUsingCustomRelayer}
          customRelayer={customRelayer}
          setCustomRelayer={setCustomRelayer}
        />
      );
    case WithdrawStep.RECEIPT:
      return (
        <WithdrawReceipt
          onDoneClick={() => {
            setWithdrawStep(WithdrawStep.DO);
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

export default DesktopWithdrawPage;
