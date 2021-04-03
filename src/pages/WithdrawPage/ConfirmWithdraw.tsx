import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { CHAIN_ID, RELAYER_URL } from "config";
import { NetworkContextName } from "index";
import React from "react";
import { Button, Container, Flex, Grid, Spinner, Text } from "theme-ui";
import { generateProof, parseNote } from "utils/snarks-functions";
import { instances } from "poof-token";
import { getContract } from "hooks/getContract";
import ERC20_TORNADO_ABI from "abis/erc20tornado.json";
import { calculateFee } from "utils/gas";

interface IProps {
  onBackClick: () => void;
  onConfirmClick: () => void;
  note: string;
  recipient: string;
  tornadoServiceFee: string;
  setTxHash: (txHash: string) => void;
}

const GAS_HARDCODE = 0.0000470652;

export const ConfirmWithdraw: React.FC<IProps> = ({
  onBackClick,
  onConfirmClick,
  note,
  recipient,
  tornadoServiceFee,
  setTxHash,
}) => {
  const { library: networkLibrary } = useWeb3React(NetworkContextName);
  const { deposit, currency, amount } = parseNote(note);
  const [loading, setLoading] = React.useState(false);

  const relayerFee = (Number(amount) * Number(tornadoServiceFee)) / 100;

  const handleWithdraw = async () => {
    if (!networkLibrary) {
      console.error("Library is not defined");
      return;
    }
    setLoading(true);
    const relayerStatus = await axios.get(RELAYER_URL + "/status");
    const {
      rewardAccount,
      gasPrices,
      tornadoServiceFee,
      celoPrices,
    } = relayerStatus.data;

    try {
      const refund: string = "0";
      const tornadoAddress =
        instances[`netId${CHAIN_ID}`][currency].instanceAddress[amount];
      const tornado = getContract(
        tornadoAddress,
        ERC20_TORNADO_ABI,
        networkLibrary
      );

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

      console.log("Sending withdraw transaction through relay");
      const relay = await axios.post(RELAYER_URL + "/relay", {
        contract: tornadoAddress,
        proof,
        args,
      });

      let done = false;
      let tries = 10;
      console.log(!done, tries > 0);
      while (!done && tries > 0) {
        const job = await axios.get(RELAYER_URL + `/v1/jobs/${relay.data.id}`);
        console.log(done);
        if (job.data.txHash) {
          setTxHash(job.data.txHash);
          console.log(
            `Transaction submitted through the relay. The transaction hash is ${job.data.txHash}`
          );
          done = true;
        } else {
          tries -= 1;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (e) {
      if (e.response) {
        console.error(e.response.data.error);
      } else {
        alert(e.message);
      }
    } finally {
      setLoading(false);
      onConfirmClick();
    }
  };

  return (
    <Container>
      <Text>Confirm Transaction</Text>
      <Text>Summary</Text>
      <Grid columns={[2]} sx={{ mb: 4 }}>
        <Text>Withdraw Amount</Text>
        <Text>
          {amount} {currency.toUpperCase()}
        </Text>
        <Text>Relayer Fee</Text>
        <Text>
          -{relayerFee} {currency.toUpperCase()}
        </Text>
        <Text>Protocol Fee</Text>
        <Text>
          -{GAS_HARDCODE} {currency.toUpperCase()}
        </Text>
        <div
          style={{
            margin: "-8px",
            height: "1px",
            gridColumnStart: 1,
            gridColumnEnd: 3,
            background: "black",
          }}
        ></div>
        <Text>Total</Text>
        <Text>
          {Number(amount) - relayerFee - GAS_HARDCODE} {currency.toUpperCase()}
        </Text>
      </Grid>
      {loading ? (
        <Spinner />
      ) : (
        <Flex sx={{ justifyContent: "flex-end" }}>
          <Button sx={{ mr: 2 }} variant="outline" onClick={onBackClick}>
            Back
          </Button>
          <Button onClick={handleWithdraw}>Confirm</Button>
        </Flex>
      )}
    </Container>
  );
};
