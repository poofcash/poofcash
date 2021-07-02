import React from "react";
import { DoWithdraw } from "pages/WithdrawPage/DesktopWithdrawPage/DoWithdraw";
import { WithdrawReceipt } from "pages/WithdrawPage/DesktopWithdrawPage/WithdrawReceipt";
import { IWithdrawProps } from "pages/WithdrawPage";

enum WithdrawStep {
  DO = "DO",
  RECEIPT = "RECEIPT",
}

const DesktopWithdrawPage: React.FC<IWithdrawProps> = ({
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
  relayerFee,
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
          relayerFee={relayerFee}
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
          recipient={recipient}
          relayerFee={relayerFee}
        />
      );
  }
};

export default DesktopWithdrawPage;
