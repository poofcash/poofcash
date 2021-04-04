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
import { BackButton } from "components/BackButton";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { Divider } from "components/Divider";
import { TableDivider } from "components/TableDivider";

interface IProps {
  onBackClick: () => void;
  onConfirmClick: () => void;
  note: string;
  recipient: string;
  tornadoServiceFee: string;
  setTxHash: (txHash: string) => void;
}

export const PRECISION = 7;
export const GAS_HARDCODE = 0.0000470652;

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

  const finalWithdrawAmount = Number(amount) - relayerFee - GAS_HARDCODE;

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
      while (!done && tries > 0) {
        const job = await axios.get(RELAYER_URL + `/v1/jobs/${relay.data.id}`);
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
      onConfirmClick();
    } catch (e) {
      if (e.response) {
        console.error(e.response.data.error);
      } else {
        alert(e.message);
      }
      onBackClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <BackButton onClick={onBackClick} />
      <Text sx={{ mb: 1 }} variant="subtitle">
        Transaction Summary
      </Text>
      <Text sx={{ mb: 4 }} variant="regular">
        Please review the transaction before continuing
      </Text>
      <Text variant="summaryTitle">Summary</Text>
      <Divider />
      <Grid columns={[2]} sx={{ mb: 4 }}>
        <Text variant="form">Withdraw Amount</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          {amount} {currency.toUpperCase()}
        </Text>
        <Text variant="form">Relayer Fee</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          -{relayerFee.toString()} {currency.toUpperCase()}
        </Text>
        <Text variant="form">Network Fee</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          -{GAS_HARDCODE.toString().slice(0, 10)} {currency.toUpperCase()}
        </Text>
        <Text variant="form">Protocol Fee</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          0 CELO
        </Text>
        <TableDivider columns={2} />
        <Text variant="subtitle">Total</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          {finalWithdrawAmount.toString().slice(0, PRECISION)}{" "}
          {currency.toUpperCase()}
        </Text>
      </Grid>
      <BottomDrawer>
        {loading ? (
          <Flex sx={{ justifyContent: "flex-end" }}>
            <Spinner />
          </Flex>
        ) : (
          <Flex sx={{ justifyContent: "space-between" }}>
            <LabelWithBalance
              label="Total"
              amount={finalWithdrawAmount.toString().slice(0, PRECISION)}
              currency={currency.toUpperCase()}
            />
            <Button onClick={handleWithdraw}>Withdraw</Button>
          </Flex>
        )}
      </BottomDrawer>
    </Container>
  );
};
