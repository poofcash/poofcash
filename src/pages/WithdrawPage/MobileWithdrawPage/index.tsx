import React from "react";
import { PickWithdraw } from "pages/WithdrawPage/MobileWithdrawPage/PickWithdraw";
import { ConfirmWithdraw } from "pages/WithdrawPage/MobileWithdrawPage/ConfirmWithdraw";
import { WithdrawReceipt } from "pages/WithdrawPage/MobileWithdrawPage/WithdrawReceipt";
import { IWithdrawProps } from "pages/WithdrawPage";

enum WithdrawStep {
  PICKER = "PICKER",
  CONFIRM = "CONFIRM",
  RECEIPT = "RECEIPT",
}

const WithdrawPage: React.FC<IWithdrawProps> = ({
  setNote,
  note,
  setRecipient,
  recipient,
  selectedRelayer,
  setSelectedRelayer,
  relayerOptions,
  usingCustomRelayer,
  setUsingCustomRelayer,
  customRelayer,
  setCustomRelayer,
  setTxHash,
  txHash,
  relayerFee,
}) => {
  const [withdrawStep, setWithdrawStep] = React.useState(WithdrawStep.PICKER);

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
          selectedRelayer={selectedRelayer!}
          relayerFee={relayerFee}
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
          recipient={recipient}
          relayerFee={relayerFee}
        />
      );
  }
};

export default WithdrawPage;
