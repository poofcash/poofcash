import React from "react";
import { DoWithdraw } from "pages/WithdrawPage/DesktopWithdrawPage/DoWithdraw";
import { WithdrawReceipt } from "pages/WithdrawPage/DesktopWithdrawPage/WithdrawReceipt";

enum WithdrawStep {
  DO = "DO",
  RECEIPT = "RECEIPT",
}

export type RelayerOption = {
  url: string;
  relayerFee: number;
};

interface IProps {
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
}

const DesktopWithdrawPage: React.FC<IProps> = ({
  setNote,
  note,
  setRecipient,
  recipient,
  setTxHash,
  selectedRelayer,
  setSelectedRelayer,
  relayerOptions,
  usingCustomRelayer,
  setUsingCustomRelayer,
  customRelayer,
  setCustomRelayer,
  txHash,
}) => {
  const [depositStep, setWithdrawStep] = React.useState(WithdrawStep.DO);
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
          selectedRelayer={selectedRelayer}
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
          poofServiceFee={selectedRelayer!.relayerFee}
          recipient={recipient}
        />
      );
  }
};

export default DesktopWithdrawPage;
