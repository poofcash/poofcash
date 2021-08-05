import React from "react";
import { PickRedeem } from "pages/RedeemPage/MobileRedeemPage/PickRedeem";
import { ConfirmRedeem } from "pages/RedeemPage/MobileRedeemPage/ConfirmRedeem";
import { RedeemReceipt } from "pages/RedeemPage/MobileRedeemPage/RedeemReceipt";
import { IRedeemProps } from "pages/RedeemPage";

enum RedeemStep {
  PICKER = "PICKER",
  CONFIRM = "CONFIRM",
  RECEIPT = "RECEIPT",
}

const RedeemPage: React.FC<IRedeemProps> = ({
  setAmount,
  amount,
  poofAmount,
  setRecipient,
  recipient,
  setTxHash,
  txHash,
  selectedRelayer,
  setSelectedRelayer,
  relayerOptions,
  usingCustomRelayer,
  setUsingCustomRelayer,
  customRelayer,
  setCustomRelayer,
  relayerFee,
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
          setRecipient={setRecipient}
          recipient={recipient}
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
          relayerFee={relayerFee}
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
