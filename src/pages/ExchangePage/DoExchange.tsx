import React from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { RewardsCeloKit } from "@poofcash/rewardscelo";
import { useTranslation } from "react-i18next";
import {
  Button,
  Container,
  Flex,
  Grid,
  Input,
  Select,
  Spinner,
  Text,
} from "theme-ui";
import { toWei, AbiItem, toBN } from "web3-utils";
import { humanFriendlyWei } from "utils/eth";
import { RCELO, SCELO, SCELO_IDX } from "config";
import erc20Abi from "abis/erc20.json";
import { GrayBox } from "components/GrayBox";
import { SummaryTable } from "components/SummaryTable";

interface IProps {
  openReceiptPage: () => void;
  currencies: { from: string; to: string };
  switchCurrencies: () => void;
  setTxHash: (txHash: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  sCELOBalance: string;
  rCELOBalance: string;
  sCELOAllowance: string;
  rCELOAllowance: string;
  refetch: () => void;
}

export const DoExchange: React.FC<IProps> = ({
  setTxHash,
  openReceiptPage,
  currencies,
  switchCurrencies,
  amount,
  setAmount,
  sCELOBalance,
  rCELOBalance,
  sCELOAllowance,
  rCELOAllowance,
  refetch,
}) => {
  const { t } = useTranslation();
  const { performActions, address } = useContractKit();
  const [loading, setLoading] = React.useState(false);

  const onExchangeClick = () => {
    setLoading(true);
    performActions(async (kit) => {
      const rewardsKit = new RewardsCeloKit(kit, RCELO);
      try {
        const txo =
          currencies.from === "sCELO"
            ? rewardsKit.deposit(toWei(amount), SCELO_IDX)
            : rewardsKit.withdraw(toWei(amount));
        const tx = await txo.send({
          from: kit.defaultAccount,
          gasPrice: toWei("0.1", "gwei"),
        });
        setTxHash(await tx.getHash());
        refetch();
        openReceiptPage();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    });
  };
  const onApproveClick = () => {
    setLoading(true);
    performActions(async (kit) => {
      const erc20 = new kit.web3.eth.Contract(
        erc20Abi as AbiItem[],
        currencies.from === "sCELO" ? SCELO : RCELO
      );
      try {
        const txo = erc20.methods.approve(RCELO, toWei(amount));
        await txo.send({
          from: kit.defaultAccount,
          gasPrice: toWei("0.1", "gwei"),
        });
        refetch();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    });
  };

  const maxBalance = currencies.from === "sCELO" ? sCELOBalance : rCELOBalance;
  const maxAllowance =
    currencies.from === "sCELO" ? sCELOAllowance : rCELOAllowance;

  let button = (
    <Button
      onClick={onApproveClick}
      disabled={amount === "0" || !address}
      sx={{ width: "100%" }}
    >
      Approve {currencies.from}
    </Button>
  );

  if (
    amount !== "" &&
    !isNaN(Number(maxAllowance)) &&
    !isNaN(Number(amount)) &&
    toBN(toWei(maxAllowance)).gte(toBN(toWei(amount)))
  ) {
    button = (
      <Button
        onClick={onExchangeClick}
        disabled={amount === "0" || !address}
        sx={{ width: "100%" }}
      >
        Exchange for {currencies.to}
      </Button>
    );
  }

  let boxContent = (
    <>
      <Text sx={{ mb: 4 }} variant="subtitle">
        {t("deposit.desktop.connectWallet.title")}
      </Text>
      <br />
      <Text variant="regularGray">
        {t("deposit.desktop.connectWallet.subtitle")}
      </Text>
    </>
  );

  if (address && amount === "") {
    boxContent = (
      <>
        <Text sx={{ mb: 4 }} variant="subtitle">
          {t("exchange.select.title")}
        </Text>
        <br />
        <Text variant="regularGray">{t("exchange.select.subtitle")}</Text>
      </>
    );
  } else if (address) {
    boxContent = (
      <>
        <Text sx={{ mb: 4 }} variant="subtitle">
          {t("exchange.review.title")}
        </Text>
        <br />
        <SummaryTable
          title="Summary"
          lineItems={[
            {
              label: "Exchange",
              value: `${amount} ${currencies.from}`,
            },
          ]}
          totalItem={{
            label: "Receive",
            value: `${amount} ${currencies.to}`,
          }}
        />
      </>
    );
  }

  return (
    <Grid sx={{ gridTemplateColumns: "1fr 1fr" }}>
      <Container>
        <Text variant="title">{t("exchange.title")}</Text>
        <br />
        <Text sx={{ mb: 4 }} variant="regularGray">
          {t("exchange.subtitle")}
        </Text>
        <br />

        <Text variant="form" sx={{ mb: 2 }}>
          Amount (max: {humanFriendlyWei(maxBalance)})
        </Text>
        <Flex>
          <Input
            type="number"
            sx={{ width: "25%" }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Select
            sx={{ minWidth: 100, ml: 2 }}
            onChange={switchCurrencies}
            value={currencies.from}
          >
            <option value={currencies.from}>{currencies.from}</option>
            <option value={currencies.to}>{currencies.to}</option>
          </Select>
        </Flex>
      </Container>
      <Container>
        <GrayBox>{boxContent}</GrayBox>
        <Flex sx={{ justifyContent: "center" }}>
          {loading ? <Spinner /> : button}
        </Flex>
      </Container>
    </Grid>
  );
};
