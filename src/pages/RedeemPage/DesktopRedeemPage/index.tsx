import React from "react";
import { DoRedeem } from "pages/RedeemPage/DesktopRedeemPage/DoRedeem";
import { RedeemReceipt } from "pages/RedeemPage/DesktopRedeemPage/RedeemReceipt";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";

enum RedeemStep {
  DO = "DO",
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

const DesktopRedeemPage: React.FC<IProps> = ({
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
