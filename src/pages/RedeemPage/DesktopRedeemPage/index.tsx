import React from "react";
import { DoRedeem } from "pages/RedeemPage/DesktopRedeemPage/DoRedeem";
import { RedeemReceipt } from "pages/RedeemPage/DesktopRedeemPage/RedeemReceipt";
import { IRedeemProps } from "pages/RedeemPage";

enum RedeemStep {
  DO = "DO",
  RECEIPT = "RECEIPT",
}

const DesktopRedeemPage: React.FC<IRedeemProps> = ({
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
  relayerFee,
}) => {
  const [redeemStep, setRedeemStep] = React.useState(RedeemStep.DO);
  switch (redeemStep) {
    case RedeemStep.DO:
      return (
        <DoRedeem
          onRedeemClick={() => {
            setRedeemStep(RedeemStep.RECEIPT);
          }}
          setAmount={setAmount}
          amount={amount}
          poofAmount={poofAmount}
          setRecipient={setRecipient}
          recipient={recipient}
          setMaxRedeemAmount={setMaxRedeemAmount}
          maxRedeemAmount={maxRedeemAmount}
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
    case RedeemStep.RECEIPT:
      return (
        <RedeemReceipt
          onDoneClick={() => {
            setRedeemStep(RedeemStep.DO);
            setAmount("");
            setRecipient("");
          }}
          amount={amount}
          poofAmount={poofAmount}
          txHash={txHash}
          poofServiceFee={selectedRelayer!.relayerFee}
          recipient={recipient}
        />
      );
  }
};

export default DesktopRedeemPage;
