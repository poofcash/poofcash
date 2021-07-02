import React from "react";
import { PickMine } from "pages/MinePage/MobileMinePage/PickMine";
import { ConfirmMine } from "pages/MinePage/MobileMinePage/ConfirmMine";
import { MineReceipt } from "pages/MinePage/MobileMinePage/MineReceipt";
import { IMineProps } from "pages/MinePage";

enum MineStep {
  PICKER = "PICKER",
  CONFIRM = "CONFIRM",
  RECEIPT = "RECEIPT",
}

const MinePage: React.FC<IMineProps> = ({
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
  relayerFee,
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
          relayerFee={relayerFee}
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
          relayerFee={relayerFee}
        />
      );
  }
};

export default MinePage;
