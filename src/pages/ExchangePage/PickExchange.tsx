import { ExchangeMode } from "hooks/exchange/useExchangeMode";
import {
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Input,
  Link,
  Select,
  Text,
} from "theme-ui";
import { exchangeCurrencies } from "config";
import { humanFriendlyWei } from "utils/eth";
import { humanFriendlyNumber } from "utils/number";
import React from "react";
import { Swap } from "phosphor-react";
import { fromWei } from "web3-utils";

interface Props {
  fromCurrency: string;
  setFromCurrency: (currency: string) => void;
  toCurrency: string;
  setToCurrency: (currency: string) => void;
  fromAmount: string;
  setFromAmount: (amount: string) => void;
  toAmount: string;
  setToAmount: (amount: string) => void;
  fromBalance: string;
  exchangeMode: ExchangeMode;
  exchangeRate: string;
}

export const PickExchange: React.FC<Props> = ({
  fromCurrency,
  setFromCurrency,
  toCurrency,
  setToCurrency,
  fromAmount,
  setFromAmount,
  fromBalance,
  toAmount,
  setToAmount,
  exchangeMode,
  exchangeRate,
}) => {
  const [inverse, setInverse] = React.useState(false);

  return (
    <>
      <Grid columns={[2, "100px 1fr"]}>
        <Box>
          <Text variant="form">From</Text>
          <Select
            onChange={(e) => setFromCurrency(e.target.value)}
            value={fromCurrency}
          >
            {exchangeCurrencies.map((curr, idx) => {
              console.log(
                fromCurrency,
                fromCurrency.toLowerCase() === "rcelo",
                curr.toLowerCase(),
                curr.toLowerCase() !== "celo"
              );
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
                max: {humanFriendlyWei(fromBalance)}
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
                <option
                  value={curr}
                  key={idx}
                  disabled={
                    fromCurrency.toLowerCase() === "rcelo" &&
                    curr.toLowerCase() !== "celo"
                  }
                >
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
    </>
  );
};
