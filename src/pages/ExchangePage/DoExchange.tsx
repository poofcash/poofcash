import React from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
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
import { toWei, toBN, fromWei } from "web3-utils";
import { humanFriendlyWei } from "utils/eth";
import { exchangeCurrencies } from "config";
import { GrayBox } from "components/GrayBox";
import { SummaryTable } from "components/SummaryTable";
import { Swap } from "phosphor-react";
import { humanFriendlyNumber } from "utils/number";
import { toast } from "react-toastify";
import { toastTx } from "utils/toastTx";
import { ExchangeMode } from "hooks/exchange/useExchangeMode";

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
  exchangeCall: () => Promise<string | undefined>;
  approveCall: () => any;
  allowance: string;
  exchangeMode: ExchangeMode;
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
  refetch,
  exchangeCall,
  approveCall,
  allowance,
  setTxHash,
  exchangeMode,
}) => {
  const { t } = useTranslation();
  const { performActions, address, connect } = useContractKit();
  const [loading, setLoading] = React.useState(false);
  const [inverse, setInverse] = React.useState(false);

  const onExchangeClick = () => {
    setLoading(true);
    performActions(async () => {
      try {
        const txHash = await exchangeCall();
        if (txHash) {
          toastTx(txHash);
          setTxHash(txHash);
          openReceiptPage();
        } else {
          toast("Failed to exchange");
        }
      } catch (e) {
        toast(e);
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
      onClick={approveCall}
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
    if (toBN(allowance).lt(toBN(toWei(fromAmount === "" ? "0" : fromAmount)))) {
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
              value: `${humanFriendlyNumber(fromAmount)} ${fromCurrency}`,
            },
          ]}
          totalItem={{
            label: "Receive",
            value: `${humanFriendlyNumber(toAmount)} ${toCurrency}`,
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
                <Link onClick={() => setFromAmount(fromWei(fromBalance))}>
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
        <Flex sx={{ alignItems: "center", justifyContent: "center", mt: 4 }}>
          <Text variant="form" mr={2}>
            Current Price
          </Text>
          <Card
            sx={{ cursor: "pointer" }}
            variant="warning"
            onClick={() => setInverse(!inverse)}
          >
            <Flex sx={{ alignItems: "center", justifyContent: "space-evenly" }}>
              <Text mr={2}>1 {inverse ? toCurrency : fromCurrency}</Text>
              <Swap size={32} />
              <Text ml={2}>
                {humanFriendlyNumber(
                  inverse ? 1 / Number(exchangeRate) : exchangeRate
                )}{" "}
                {inverse ? fromCurrency : toCurrency}
              </Text>
            </Flex>
          </Card>
        </Flex>
        <Flex sx={{ alignItems: "center", justifyContent: "center", mt: 4 }}>
          <Text variant="form" mr={2}>
            Exchange mode
          </Text>
          <Card
            sx={{ cursor: "pointer" }}
            variant="warning"
            onClick={() => setInverse(!inverse)}
          >
            <Text>
              {exchangeMode === ExchangeMode.UBESWAP ? "Ubeswap" : "Direct"}
            </Text>
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
