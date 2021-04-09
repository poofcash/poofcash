import React from "react";
import { RELAYER_URL } from "config";
import { DoWithdraw } from "pages/WithdrawPage/DesktopWithdrawPage/DoWithdraw";
import { WithdrawReceipt } from "pages/WithdrawPage/DesktopWithdrawPage/WithdrawReceipt";
import axios from "axios";

enum WithdrawStep {
  DO = "DO",
  RECEIPT = "RECEIPT",
}

const DesktopWithdrawPage: React.FC = () => {
  const [depositStep, setWithdrawStep] = React.useState(WithdrawStep.DO);
  const [note, setNote] = React.useState("");
  const [recipient, setRecipient] = React.useState("");
  const [tornadoServiceFee, setTornadoServiceFee] = React.useState("");
  const [txHash, setTxHash] = React.useState("");

  React.useEffect(() => {
    const fn = async () => {
      const relayerStatus = await axios.get(RELAYER_URL + "/status");
      const { tornadoServiceFee } = relayerStatus.data;
      setTornadoServiceFee(tornadoServiceFee);
    };
    fn();
  }, [setTornadoServiceFee]);

  switch (depositStep) {
    case WithdrawStep.DO:
      return (
        <DoWithdraw
          onWithdrawClick={() => {
            setWithdrawStep(WithdrawStep.RECEIPT);
          }}
          setNote={setNote}
          note={note}
          setRecipient={setRecipient}
          recipient={recipient}
          tornadoServiceFee={tornadoServiceFee}
          setTxHash={setTxHash}
        />
      );
    case WithdrawStep.RECEIPT:
      return (
        <WithdrawReceipt
          onDoneClick={() => {
            setWithdrawStep(WithdrawStep.DO);
            setNote("");
            setRecipient("");
          }}
          note={note}
          txHash={txHash}
          tornadoServiceFee={tornadoServiceFee}
          recipient={recipient}
        />
      );
  }
};

export default DesktopWithdrawPage;
