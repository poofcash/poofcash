import React from "react";
import { PickRedeem } from "pages/RedeemPage/MobileRedeemPage/PickRedeem";
import { ConfirmRedeem } from "pages/RedeemPage/MobileRedeemPage/ConfirmRedeem";
import { RedeemReceipt } from "pages/RedeemPage/MobileRedeemPage/RedeemReceipt";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";

enum RedeemStep {
  PICKER = "PICKER",
  CONFIRM = "CONFIRM",
  RECEIPT = "RECEIPT",
}

interface IProps {
  setAmount: (amount: string) => void;
  amount: string;
  poofAmount: string;
  setRecipient: (recipient: string) => void;
  recipient: string;
  setMaxRedeemAmount: (amount: string) => void;
  maxRedeemAmount?: string;
  setTxHash: (txHash: string) => void;
  txHash: string;
  selectedRelayer?: RelayerOption;
  setSelectedRelayer: (selectedRelayer?: RelayerOption) => void;
  relayerOptions?: Array<RelayerOption>;
  usingCustomRelayer: boolean;
  setUsingCustomRelayer: (usingCustomRelayer: boolean) => void;
  customRelayer?: RelayerOption;
  setCustomRelayer: (relayerOption?: RelayerOption) => void;
}

const RedeemPage: React.FC<IProps> = ({
  setAmount,
  amount,
  poofAmount,
  setRecipient,
  recipient,
  setMaxRedeemAmount,
  maxRedeemAmount,
  setTxHash,
  txHash,
  selectedRelayer,
  setSelectedRelayer,
  relayerOptions,
  usingCustomRelayer,
  setUsingCustomRelayer,
  customRelayer,
  setCustomRelayer,
}) => {
  const [redeemStep, setRedeemStep] = React.useState(RedeemStep.PICKER);
  switch (redeemStep) {
    case RedeemStep.PICKER:
      return (
        <PickRedeem
          onRedeemClick={() => {
            setRedeemStep(RedeemStep.CONFIRM);
          }}
          setAmount={setAmount}
          amount={amount}
          poofAmount={poofAmount}
          setMaxRedeemAmount={setMaxRedeemAmount}
          maxRedeemAmount={maxRedeemAmount}
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
    case RedeemStep.CONFIRM:
      return (
        <ConfirmRedeem
          onBackClick={() => setRedeemStep(RedeemStep.PICKER)}
          onConfirmClick={() => setRedeemStep(RedeemStep.RECEIPT)}
          amount={amount}
          poofAmount={poofAmount}
          recipient={recipient}
          setTxHash={setTxHash}
          selectedRelayer={selectedRelayer!}
        />
      );
    case RedeemStep.RECEIPT:
      return (
        <RedeemReceipt
          onDoneClick={() => {
            setRedeemStep(RedeemStep.PICKER);
            setAmount("");
            setRecipient("");
          }}
          amount={amount}
          poofAmount={poofAmount}
          txHash={txHash}
          recipient={recipient}
        />
      );
  }
};

export default RedeemPage;
