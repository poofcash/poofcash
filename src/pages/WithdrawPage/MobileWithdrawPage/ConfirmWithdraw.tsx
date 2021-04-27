import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { CHAIN_ID } from "config";
import { NetworkContextName } from "index";
import React from "react";
import { Button, Container, Flex, Spinner, Text } from "theme-ui";
import { generateProof, parseNote } from "utils/snarks-functions";
import { instances } from "@poofcash/poof-token";
import { getContract } from "hooks/getContract";
import ERC20_TORNADO_ABI from "abis/erc20tornado.json";
import { calculateFee } from "utils/gas";
import { BackButton } from "components/BackButton";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { SummaryTable } from "components/SummaryTable";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";

interface IProps {
  onBackClick: () => void;
  onConfirmClick: () => void;
  note: string;
  recipient: string;
  setTxHash: (txHash: string) => void;
  selectedRelayer: RelayerOption;
}

export const PRECISION = 7;
export const GAS_HARDCODE = 0.0000470652;

export const ConfirmWithdraw: React.FC<IProps> = ({
  onBackClick,
  onConfirmClick,
  note,
  recipient,
  setTxHash,
  selectedRelayer,
}) => {
  const { library: networkLibrary } = useWeb3React(NetworkContextName);
  const { deposit, currency, amount } = parseNote(note);
  const [loading, setLoading] = React.useState(false);

  const relayerFee = (Number(amount) * selectedRelayer.relayerFee) / 100;

  const finalWithdrawAmount = Number(amount) - relayerFee - GAS_HARDCODE;

  const handleWithdraw = async () => {
    if (!networkLibrary) {
      console.error("Library is not defined");
      return;
    }
    setLoading(true);
    const relayerStatus = await axios.get(selectedRelayer.url + "/status");
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
      const relay = await axios.post(selectedRelayer.url + "/relay", {
        contract: tornadoAddress,
        proof,
        args,
      });

      let done = false;
      let tries = 10;
      while (!done && tries > 0) {
        const job = await axios.get(
          selectedRelayer.url + `/v1/jobs/${relay.data.id}`
        );
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
      <Text sx={{ mb: 4 }} variant="regularGray">
        Please review the transaction before continuing
      </Text>

      <SummaryTable
        title="Summary"
        lineItems={[
          {
            label: "Withdrawal Amount",
            value: `${amount} ${currency.toUpperCase()}`,
          },
          {
            label: `Relayer Fee - ${selectedRelayer?.relayerFee}%`,
            value: `-${relayerFee.toString()} ${currency.toUpperCase()}`,
          },
          { label: "Protocol Fee", value: `0 CELO` },
        ]}
        totalItem={{
          label: "Total",
          value: `${finalWithdrawAmount
            .toString()
            .slice(0, PRECISION)} ${currency.toUpperCase()}`,
        }}
      />
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
