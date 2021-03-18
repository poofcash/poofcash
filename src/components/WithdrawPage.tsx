import React from "react";
import axios from "axios";
import { generateProof, parseNote } from "utils/snarks-functions";
import { NETWORK, TORNADO_INSTANCES_ADDRESSES, RELAYER_URL } from "config";
import Spinner from "./Spinner";
import { useTornadoTokenContract } from "hooks/getContract";
import { network } from "connectors";
import { useWeb3React } from "@web3-react/core";

const WithdrawPage = () => {
  const { activate } = useWeb3React();
  React.useEffect(() => {
    activate(network);
  }, [activate]);

  const [state, setState] = React.useState({
    noteWithdraw: "",
    ethAddress: "",
    loading: false,
    proofGenerated: false,
    txSent: false,
    error: false,
  });
  const tornadoAddress = TORNADO_INSTANCES_ADDRESSES[NETWORK][0.1]; // TODO: hardcode
  const tornado = useTornadoTokenContract(tornadoAddress, true);
  console.log(tornadoAddress, tornado);

  const handleChange = (event: any) => {
    // Handle change of input fields
    switch (event.target.name) {
      case "ethRecipientAddress":
        setState({ ...state, ethAddress: event.target.value, txSent: false });
        break;
      case "note":
        setState({ ...state, noteWithdraw: event.target.value, txSent: false });
        break;
      default:
        break;
    }
  };

  /**
   * Do an ETH withdrawal
   */
  const withdrawHandler = async () => {
    setState({ ...state, loading: true, txSent: false, error: false });
    const relayerStatus = await axios.get(RELAYER_URL + "/status");
    const { relayerAddress } = relayerStatus.data;

    try {
      const refund: string = "0";
      const recipient = state.ethAddress;
      const { deposit } = parseNote(state.noteWithdraw);

      // generate the proof
      console.log("Generating proof. This may take a few minutes...");
      console.log(tornado); // TODO delete
      let { proof, args } = await generateProof({
        deposit,
        recipient,
        relayerAddress,
        refund,
        tornado,
      });

      setState({ ...state, proofGenerated: true });
      console.log(proof, args);

      console.log("Sending withdraw transaction through relay");
      try {
        const relay = await axios.post(RELAYER_URL + "/relay", {
          contract: tornadoAddress,
          proof,
          args,
        });
        console.log(
          `Transaction submitted through the relay. The transaction hash is ${relay.data.txHash}`
        );

        // TODO
        // const receipt = await waitForTxReceipt({ txHash: relay.data.txHash });
        // console.log('Transaction mined in block', receipt.blockNumber);
      } catch (e) {
        if (e.response) {
          console.error(e.response.data.error);
        } else {
          console.error(e.message);
        }
      }

      //   // sign and send withdraw transaction
      //   console.log('Signing and sending withdraw transaction...');
      //   const nonce = await web3.eth.getTransactionCount(accountSender.address);
      //   const txData = await tornado.methods.withdraw(proof, ...args).encodeABI();
      //   const txSigned = await web3.eth.accounts.signTransaction(
      //     {
      //       nonce: nonce,
      //       to: tornadoAddress,
      //       value: refund.toString(),
      //       data: txData,
      //       gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
      //       gas: web3.utils.toHex(1e6),
      //     },
      //     '0x' + senderPrivateKey,
      //   );

      //   let receipt = await web3.eth.sendSignedTransaction(txSigned.rawTransaction);
      //   console.log('SUCCESS! Withdraw transaction sent', receipt);
      setState({
        ...state,
        loading: false,
        proofGenerated: false,
        txSent: true,
        noteWithdraw: "",
        error: false,
      });
    } catch (e) {
      console.log("ERROR: Withdraw transaction not sent", e);
      setState({
        ...state,
        loading: false,
        proofGenerated: false,
        txSent: false,
        error: true,
      });
    }
  };

  let loadingInfo = <></>;
  let proofGenerated = <></>;
  let sendingTx = <></>;
  let txSent = <></>;

  let withdrawButton = (
    <button
      className="hover-button withdraw-button"
      onClick={withdrawHandler}
      disabled={state.ethAddress === "" || state.noteWithdraw === ""}
    >
      Withdraw
    </button>
  );

  if (state.loading) {
    withdrawButton = <Spinner></Spinner>;
    loadingInfo = <div>1. Generating proof...</div>;
    if (state.proofGenerated) {
      sendingTx = <div>2. Sending transaction...</div>;
    }
  }

  if (state.txSent && !state.error) {
    txSent = (
      <div className="successful-withdrawal">
        <p className="withdraw-success-message">Success!</p>
        <p className="withdraw-sent-message">CELO tokens were sent to:</p>
        <br />
        <b>{state.ethAddress}</b>
      </div>
    );
  }

  if (state.error) {
    txSent = (
      <div className="successful-withdrawal">
        <p className="withdraw-error-message">Something went wrong :(</p>
        <span>Check console for more information</span>
      </div>
    );
  }

  return (
    <div className="withdraw-wrapper">
      <label className="withdraw-note-label">
        <b>Your Note:</b>
        <input
          name="note"
          type="text"
          value={state.noteWithdraw}
          onChange={handleChange}
        />
      </label>
      <br />
      <label className="btc-recipient-label">
        <b>Recipient's Ethereum Address:</b>
        <input
          name="ethRecipientAddress"
          type="text"
          value={state.ethAddress}
          onChange={handleChange}
        />
      </label>
      <div className="withdrawal-info">
        {withdrawButton}
        {loadingInfo}
        {proofGenerated}
        {sendingTx}
        {txSent}
      </div>
    </div>
  );
};

export default WithdrawPage;
