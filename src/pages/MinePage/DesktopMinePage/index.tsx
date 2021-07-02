import React from "react";
import { DoMine } from "pages/MinePage/DesktopMinePage/DoMine";
import { MineReceipt } from "pages/MinePage/DesktopMinePage/MineReceipt";
import { IMineProps } from "pages/MinePage";

enum MineStep {
  DO = "DO",
  RECEIPT = "RECEIPT",
}

const DesktopMinePage: React.FC<IMineProps> = ({
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
  const [depositStep, setMineStep] = React.useState(MineStep.DO);
  switch (depositStep) {
    case MineStep.DO:
      return (
        <DoMine
          onMineClick={() => {
            setMineStep(MineStep.RECEIPT);
          }}
          setNote={setNote}
          note={note}
          noteIsValid={noteIsValid}
          estimatedAp={estimatedAp}
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
    case MineStep.RECEIPT:
      return (
        <MineReceipt
          onDoneClick={() => {
            setMineStep(MineStep.DO);
            setNote("");
          }}
          estimatedAp={estimatedAp}
          txHash={txHash}
          relayerFee={relayerFee}
        />
      );
  }
};

export default DesktopMinePage;
