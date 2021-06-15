import React from "react";
import { PickMine } from "pages/MinePage/MobileMinePage/PickMine";
import { ConfirmMine } from "pages/MinePage/MobileMinePage/ConfirmMine";
import { MineReceipt } from "pages/MinePage/MobileMinePage/MineReceipt";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";

enum MineStep {
  PICKER = "PICKER",
  CONFIRM = "CONFIRM",
  RECEIPT = "RECEIPT",
}

interface IProps {
  setNote: (note: string) => void;
  note: string;
  noteIsValid: boolean;
  estimatedAp: number;
  setTxHash: (txHash: string) => void;
  txHash: string;
  selectedRelayer?: RelayerOption;
  setSelectedRelayer: (relayer?: RelayerOption) => void;
  relayerOptions?: Array<RelayerOption>;
  usingCustomRelayer: boolean;
  setUsingCustomRelayer: (usingCustomRelayer: boolean) => void;
  customRelayer?: RelayerOption;
  setCustomRelayer: (relayerOption?: RelayerOption) => void;
}

const MinePage: React.FC<IProps> = ({
  setNote,
  note,
  noteIsValid,
  estimatedAp,
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
  const [withdrawStep, setMineStep] = React.useState(MineStep.PICKER);
  switch (withdrawStep) {
    case MineStep.PICKER:
      return (
        <PickMine
          onMineClick={() => {
            setMineStep(MineStep.CONFIRM);
          }}
          setNote={setNote}
          note={note}
          noteIsValid={noteIsValid}
          estimatedAp={estimatedAp}
          selectedRelayer={selectedRelayer}
          setSelectedRelayer={setSelectedRelayer}
          relayerOptions={relayerOptions}
          usingCustomRelayer={usingCustomRelayer}
          setUsingCustomRelayer={setUsingCustomRelayer}
          customRelayer={customRelayer}
          setCustomRelayer={setCustomRelayer}
        />
      );
    case MineStep.CONFIRM:
      return (
        <ConfirmMine
          onBackClick={() => setMineStep(MineStep.PICKER)}
          onConfirmClick={() => setMineStep(MineStep.RECEIPT)}
          note={note}
          estimatedAp={estimatedAp}
          setTxHash={setTxHash}
          selectedRelayer={selectedRelayer!}
        />
      );
    case MineStep.RECEIPT:
      return (
        <MineReceipt
          onDoneClick={() => {
            setMineStep(MineStep.PICKER);
            setNote("");
          }}
          estimatedAp={estimatedAp}
          txHash={txHash}
        />
      );
  }
};

export default MinePage;
