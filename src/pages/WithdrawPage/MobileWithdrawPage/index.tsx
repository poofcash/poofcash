import React from "react";
import { PickWithdraw } from "pages/WithdrawPage/MobileWithdrawPage/PickWithdraw";
import { ConfirmWithdraw } from "pages/WithdrawPage/MobileWithdrawPage/ConfirmWithdraw";
import { WithdrawReceipt } from "pages/WithdrawPage/MobileWithdrawPage/WithdrawReceipt";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";

enum WithdrawStep {
  PICKER = "PICKER",
  CONFIRM = "CONFIRM",
  RECEIPT = "RECEIPT",
}

interface IProps {
  setNote: (note: string) => void;
  note: string;
  setRecipient: (recipient: string) => void;
  recipient: string;
  selectedRelayer?: RelayerOption;
  setSelectedRelayer: (relayer?: RelayerOption) => void;
  relayerOptions?: Array<RelayerOption>;
  usingCustomRelayer: boolean;
  setUsingCustomRelayer: (usingCustomRelayer: boolean) => void;
  customRelayer?: RelayerOption;
  setCustomRelayer: (relayerOption?: RelayerOption) => void;
  setTxHash: (txHash: string) => void;
  txHash: string;
}

const WithdrawPage: React.FC<IProps> = ({
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
          poofServiceFee={selectedRelayer!.relayerFee}
          recipient={recipient}
        />
      );
  }
};

export default WithdrawPage;
