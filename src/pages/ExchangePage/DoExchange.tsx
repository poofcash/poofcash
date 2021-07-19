import React from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { RewardsCeloKit } from "@poofcash/rewardscelo";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Input,
  Link,
  Select,
  Spinner,
  Text,
} from "theme-ui";
import { toWei, AbiItem, toBN } from "web3-utils";
import { humanFriendlyWei } from "utils/eth";
import { CURRENCY_MAP, exchangeCurrencies } from "config";
import erc20Abi from "abis/ERC20.json";
import { GrayBox } from "components/GrayBox";
import { SummaryTable } from "components/SummaryTable";
import { Swap } from "phosphor-react";
import { humanFriendlyNumber } from "utils/number";

interface IProps {
  openReceiptPage: () => void;
  fromCurrency: string;
  setFromCurrency: (currency: string) => void;
  toCurrency: string;
  setToCurrency: (currency: string) => void;
  setTxHash: (txHash: string) => void;
  fromAmount: string;
  setFromAmount: (amount: string) => void;
  toAmount: string;
  setToAmount: (amount: string) => void;
  fromBalance: string;
  fromAllowance: string;
  exchangeRate: string;
  refetch: () => void;
}

export const DoExchange: React.FC<IProps> = ({
  openReceiptPage,
  fromCurrency,
  setFromCurrency,
  fromAmount,
  setFromAmount,
  toCurrency,
  setToCurrency,
  exchangeRate,
  toAmount,
  setToAmount,
  fromBalance,
  fromAllowance,
  refetch,
}) => {
  const { t } = useTranslation();
  const { performActions, address, connect, network } = useContractKit();
  const [loading, setLoading] = React.useState(false);

  const onExchangeClick = () => {
    setLoading(true);
    performActions(async (kit) => {
      const rewardsKit = new RewardsCeloKit(
        kit,
        CURRENCY_MAP[network.chainId].rcelo
      );
      try {
        // const txo =
        //   currencies.from === "sCELO"
        //     ? rewardsKit.deposit(toWei(amount), rCELOMap[network.chainId])
        //     : rewardsKit.withdraw(toWei(amount));
        // const tx = await txo.send({
        //   from: kit.defaultAccount,
        //   gasPrice: toWei("0.1", "gwei"),
        // });
        // setTxHash(await tx.getHash());
        openReceiptPage();
      } catch (e) {
        console.error(e);
      } finally {
        refetch();
        setLoading(false);
      }
    });
  };
  const onApproveClick = () => {
    setLoading(true);
    performActions(async (kit) => {
      const erc20 = new kit.web3.eth.Contract(
        erc20Abi as AbiItem[],
        fromCurrency === "sCELO"
          ? CURRENCY_MAP[network.chainId].scelo
          : CURRENCY_MAP[network.chainId].rcelo
      );
      try {
        const txo = erc20.methods.approve(
          CURRENCY_MAP[network.chainId].rcelo,
          toWei(fromAmount)
        );
        await txo.send({
          from: kit.defaultAccount,
          gasPrice: toWei("0.1", "gwei"),
        });
      } catch (e) {
        console.error(e);
      } finally {
        refetch();
        setLoading(false);
      }
    });
  };

  const connectWalletButton = (
    <Button
      variant="primary"
      onClick={() => connect().then(console.warn)}
      sx={{ width: "100%" }}
    >
      Connect Wallet
    </Button>
  );

  const approveButton = (
    <Button
      onClick={onApproveClick}
      disabled={!address || Number(fromAmount) <= 0}
      sx={{ width: "100%" }}
    >
      Approve {fromCurrency}
    </Button>
  );

  const exchangeButton = (
    <Button
      onClick={onExchangeClick}
      disabled={Number(fromAmount) <= 0 || !address}
      sx={{ width: "100%" }}
    >
      Exchange for {toCurrency}
    </Button>
  );

  let button = connectWalletButton;
  if (address) {
    if (
      fromCurrency === "sCELO" &&
      toBN(fromAllowance).lt(toBN(toWei(fromAmount === "" ? "0" : fromAmount)))
    ) {
      button = approveButton;
    } else {
      button = exchangeButton;
    }
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

  if (address && fromAmount === "0") {
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
              value: `${fromAmount} ${fromCurrency}`,
            },
          ]}
          totalItem={{
            label: "Receive",
            value: `${toAmount} ${toCurrency}`,
          }}
        />
      </>
    );
  }

  return (
    <Grid sx={{ gridTemplateColumns: ["1fr", "1fr 1fr"] }}>
      <Container>
        <Text variant="title">{t("exchange.title")}</Text>
        <br />
        <Text sx={{ mb: 4 }} variant="regularGray">
          {t("exchange.subtitle")}
        </Text>
        <br />

        <Grid columns={[2, "100px 1fr"]}>
          <Box>
            <Text variant="form">From</Text>
            <Select
              onChange={(e) => setFromCurrency(e.target.value)}
              value={fromCurrency}
            >
              {exchangeCurrencies.map((curr, idx) => {
                return (
                  <option value={curr} key={idx}>
                    {curr}
                  </option>
                );
              })}
            </Select>
          </Box>
          <Box>
            <Container sx={{ textAlign: "right" }}>
              <Text variant="form">
                <Link
                  onClick={() => setFromAmount(humanFriendlyWei(fromBalance))}
                >
                  max: {humanFriendlyWei(fromBalance)} {fromCurrency}
                </Link>
              </Text>
            </Container>
            <Input
              type="number"
              sx={{ width: "100%" }}
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
            />
          </Box>
          <Box>
            <Text variant="form">To</Text>
            <Select
              onChange={(e) => setToCurrency(e.target.value)}
              value={toCurrency}
            >
              {exchangeCurrencies.map((curr, idx) => {
                return (
                  <option value={curr} key={idx}>
                    {curr}
                  </option>
                );
              })}
            </Select>
          </Box>
          <Flex sx={{ alignItems: "flex-end" }}>
            <Input
              type="number"
              sx={{ width: "100%" }}
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
            />
          </Flex>
        </Grid>
        <Flex
          sx={{ alignItems: "center", justifyContent: "space-evenly", mt: 4 }}
        >
          <Text variant="form">Current Price</Text>
          <Card variant="warning">
            <Flex sx={{ alignItems: "center", justifyContent: "space-evenly" }}>
              <Text mr={2}>1 {fromCurrency}</Text>
              <Swap size={32} />
              <Text ml={2}>
                {humanFriendlyNumber(exchangeRate)} {toCurrency}
              </Text>
            </Flex>
          </Card>
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
