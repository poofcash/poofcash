import React from "react";
import web3 from "web3";
import { PickWithdraw } from "pages/WithdrawPage/MobileWithdrawPage/PickWithdraw";
import { Button, Container, Flex, Grid, Spinner, Text } from "theme-ui";
import { GrayBox } from "components/GrayBox";
import { useTranslation } from "react-i18next";
import { SummaryTable } from "components/SummaryTable";
import { GAS_HARDCODE, PRECISION } from "../MobileWithdrawPage/ConfirmWithdraw";
import { useWeb3React } from "@web3-react/core";
import ERC20_TORNADO_ABI from "abis/erc20tornado.json";
import { generateProof, isValidNote, parseNote } from "utils/snarks-functions";
import axios from "axios";
import { instances } from "@poofcash/poof-token";
import { CHAIN_ID } from "config";
import { getContract } from "hooks/getContract";
import { calculateFee } from "utils/gas";
import { NetworkContextName } from "index";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";

interface IProps {
  onWithdrawClick: () => void;
  setNote: (note: string) => void;
  note: string;
  setRecipient: (recipient: string) => void;
  recipient: string;
  setTxHash: (txHash: string) => void;
  selectedRelayer?: RelayerOption;
  setSelectedRelayer: (relayer?: RelayerOption) => void;
  relayerOptions?: Array<RelayerOption>;
  usingCustomRelayer: boolean;
  setUsingCustomRelayer: (usingCustomRelayer: boolean) => void;
  customRelayer?: RelayerOption;
  setCustomRelayer: (relayerOption?: RelayerOption) => void;
}

export const DoWithdraw: React.FC<IProps> = ({
  onWithdrawClick,
  setNote,
  note,
  setRecipient,
  recipient,
  setTxHash,
  selectedRelayer,
  setSelectedRelayer,
  relayerOptions,
  usingCustomRelayer,
  setUsingCustomRelayer,
  customRelayer,
  setCustomRelayer,
}) => {
  const { t } = useTranslation();
  const { library: networkLibrary } = useWeb3React(NetworkContextName);
  const { deposit, currency, amount } = parseNote(note);
  const [loading, setLoading] = React.useState(false);

  const relayerFee =
    (Number(amount) * Number(selectedRelayer?.relayerFee)) / 100 ?? 0;

  const finalWithdrawAmount = Number(amount) - relayerFee - GAS_HARDCODE;

  const handleWithdraw = async () => {
    if (!networkLibrary) {
      console.error("Library is not defined");
      return;
    }

    if (!selectedRelayer) {
      alert("Relayer is undefined");
      return;
    }

    setLoading(true);
    const relayerStatus = await axios.get(selectedRelayer.url + "/status");
    const {
      rewardAccount,
      gasPrices,
      poofServiceFee,
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
        poofServiceFee,
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
      onWithdrawClick();
    } catch (e) {
      if (e.response) {
        console.error(e.response.data.error);
      } else {
        console.debug(e);
        alert(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  let boxContent = (
    <>
      <Text sx={{ mb: 4 }} variant="subtitle">
        {t("withdraw.desktop.specify.title")}
      </Text>
      <Text variant="regularGray">
        {t("withdraw.desktop.specify.subtitle")}
      </Text>
    </>
  );
  if (isValidNote(note)) {
    boxContent = (
      <>
        <Text sx={{ mb: 4 }} variant="subtitle">
          {t("withdraw.desktop.review.title")}
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
              value: `-${relayerFee
                .toString()
                .slice(0, PRECISION)} ${currency.toUpperCase()}`,
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
      </>
    );
  }

  return (
    <Grid sx={{ gridTemplateColumns: "1fr 1fr" }}>
      <Container>
        <Text variant="title">{t("withdraw.desktop.title")}</Text>
        <Text sx={{ mb: 4 }} variant="regularGray">
          {t("withdraw.desktop.subtitle")}
        </Text>
        <PickWithdraw
          loading={loading}
          onWithdrawClick={onWithdrawClick}
          setNote={setNote}
          note={note}
          setRecipient={setRecipient}
          recipient={recipient}
          setSelectedRelayer={setSelectedRelayer}
          relayerOptions={relayerOptions}
          usingCustomRelayer={usingCustomRelayer}
          setUsingCustomRelayer={setUsingCustomRelayer}
          customRelayer={customRelayer}
          setCustomRelayer={setCustomRelayer}
        />
      </Container>
      <Container>
        <GrayBox>{boxContent}</GrayBox>
        <Flex sx={{ justifyContent: "center" }}>
          {loading ? (
            <Spinner />
          ) : (
            <Button
              variant="primary"
              onClick={handleWithdraw}
              sx={{ width: "100%" }}
              disabled={(() => {
                if (!isValidNote) {
                  return true;
                }
                if (!web3.utils.isAddress(recipient)) {
                  return true;
                }
                if (usingCustomRelayer) {
                  if (!customRelayer) {
                    return true;
                  }
                }
                return false;
              })()}
            >
              Withdraw
            </Button>
          )}
        </Flex>
      </Container>
    </Grid>
  );
};
