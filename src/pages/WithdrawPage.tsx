import React from "react";
import axios from "axios";
import { generateProof, parseNote } from "utils/snarks-functions";
import { BLOCKSCOUT_URL, CHAIN_ID, RELAYER_URL } from "config";
import { getContract } from "hooks/getContract";
import { useWeb3React } from "@web3-react/core";
import ERC20_TORNADO_ABI from "abis/erc20tornado.json";
import { calculateFee } from "utils/gas";
import { instances } from "poof-token";
import { NetworkContextName } from "index";
import { Spinner } from "@theme-ui/components";
import { Button, Container, Input, Label } from "theme-ui";

const WithdrawPage = () => {
  const { library } = useWeb3React(NetworkContextName);

  const [state, setState] = React.useState({
    noteWithdraw: "",
    recipientAddress: "",
    loading: false,
    proofGenerated: false,
    txSent: false,
    error: false,
  });
  const [txHash, setTxHash] = React.useState();
  const handleChange = (event: any) => {
    // Handle change of input fields
    switch (event.target.name) {
      case "recipientAddress":
        setState({
          ...state,
          recipientAddress: event.target.value,
          txSent: false,
        });
        break;
      case "note":
        setState({ ...state, noteWithdraw: event.target.value, txSent: false });
        break;
      default:
        break;
    }
  };

  /**
   * Do a CELO withdrawal
   */
  const withdrawHandler = async () => {
    if (!library) {
      console.error("Library is not defined");
      return;
    }
    setState({ ...state, loading: true, txSent: false, error: false });
    const relayerStatus = await axios.get(RELAYER_URL + "/status");
    const {
      rewardAccount,
      gasPrices,
      tornadoServiceFee,
      celoPrices,
    } = relayerStatus.data;

    try {
      const refund: string = "0";
      const recipient = state.recipientAddress;
      const { deposit, currency, amount } = parseNote(state.noteWithdraw);
      const tornadoAddress =
        instances[`netId${CHAIN_ID}`][currency].instanceAddress[amount];
      const tornado = getContract(tornadoAddress, ERC20_TORNADO_ABI, library);

      const fee = calculateFee({
        gasPrices,
        currency,
        amount,
        celoPrices,
        tornadoServiceFee,
        decimals: 18,
      }); // TODO decimals hardcode

      // generate the proof
      console.log("Generating proof.");
      let { proof, args } = await generateProof({
        deposit,
        recipient,
        rewardAccount,
        refund,
        fee,
        tornado,
      });

      setState({ ...state, proofGenerated: true });

      console.log("Sending withdraw transaction through relay");
      try {
        const relay = await axios.post(RELAYER_URL + "/relay", {
          contract: tornadoAddress,
          proof,
          args,
        });

        // TODO fragile to wait 5 seconds
        setTimeout(() => {
          axios
            .get(RELAYER_URL + `/v1/jobs/${relay.data.id}`)
            .then((job) => {
              setTxHash(job.data.txhash);
              console.log(
                `Transaction submitted through the relay. The transaction hash is ${job.data.txHash}`
              );
              setTxHash(job.data.txHash);
            })
            .catch(console.error);
        }, 5000);
      } catch (e) {
        if (e.response) {
          console.error(e.response.data.error);
        } else {
          console.error(e.message);
        }
      }

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
    <Container mt={16}>
      <Button
        variant="primary"
        onClick={withdrawHandler}
        disabled={state.recipientAddress === "" || state.noteWithdraw === ""}
      >
        Withdraw
      </Button>
    </Container>
  );

  if (state.loading) {
    withdrawButton = <Spinner />;
    loadingInfo = <div>1. Generating proof. This may take a few minutes.</div>;
    if (state.proofGenerated) {
      sendingTx = <div>2. Sending transaction...</div>;
    }
  }

  if (state.txSent && !state.error) {
    txSent = (
      <div>
        <p>Success!</p>
        <p>CELO tokens were sent to:</p>
        <b>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${BLOCKSCOUT_URL}/address/${state.recipientAddress}`}
          >
            {state.recipientAddress}
          </a>
        </b>
        <br />
        {txHash ? (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${BLOCKSCOUT_URL}/tx/${txHash}`}
          >
            View transaction on Blockscout
          </a>
        ) : (
          <p>Fetching transaction hash...</p>
        )}
      </div>
    );
  }

  if (state.error) {
    txSent = (
      <div>
        <p>Something went wrong :(</p>
        <span>Check console for more information</span>
      </div>
    );
  }

  return (
    <div>
      <Label htmlFor="note">Note</Label>
      <Input
        name="note"
        type="text"
        value={state.noteWithdraw}
        onChange={handleChange}
      />
      <br />
      <Label htmlFor="recipientAddress">Recipient address</Label>
      <Input
        name="recipientAddress"
        type="text"
        value={state.recipientAddress}
        onChange={handleChange}
      />
      <div>
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
