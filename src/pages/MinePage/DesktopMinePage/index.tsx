import React from "react";
import { DoMine } from "pages/MinePage/DesktopMinePage/DoMine";
import { MineReceipt } from "pages/MinePage/DesktopMinePage/MineReceipt";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";

enum MineStep {
  DO = "DO",
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

const DesktopMinePage: React.FC<IProps> = ({
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
        />
      );
  }
};

export default DesktopMinePage;
