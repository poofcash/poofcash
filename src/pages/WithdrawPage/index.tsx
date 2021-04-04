import React from "react";
import axios from "axios";
import { RELAYER_URL } from "config";
import { PickWithdraw } from "pages/WithdrawPage/PickWithdraw";
import { ConfirmWithdraw } from "pages/WithdrawPage/ConfirmWithdraw";
import { WithdrawReceipt } from "pages/WithdrawPage/WithdrawReceipt";

enum WithdrawStep {
  PICKER = "PICKER",
  CONFIRM = "CONFIM",
  RECEIPT = "RECEIPT",
}

const WithdrawPage = () => {
  const [withdrawStep, setWithdrawStep] = React.useState(WithdrawStep.PICKER);
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
        />
      );
    case WithdrawStep.CONFIRM:
      return (
        <ConfirmWithdraw
          onBackClick={() => setWithdrawStep(WithdrawStep.PICKER)}
          onConfirmClick={() => setWithdrawStep(WithdrawStep.RECEIPT)}
          note={note}
          recipient={recipient}
          tornadoServiceFee={tornadoServiceFee}
          setTxHash={setTxHash}
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
          tornadoServiceFee={tornadoServiceFee}
          recipient={recipient}
        />
      );
  }
};

export default WithdrawPage;
