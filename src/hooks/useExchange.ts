import React from "react";
import {
  CELO,
  Pair,
  TokenAmount,
  Route,
  Trade,
  TradeType,
  Token,
  ChainId,
} from "@ubeswap/sdk";
import { AbiItem, fromWei, toWei } from "web3-utils";
import SavingsCELOAbi from "abis/SavingsCELO.json";
import UbeswapPairAbi from "abis/UbeswapPair.json";
import { useContractKit } from "@celo-tools/use-contractkit";
import { CURRENCY_MAP } from "config";
import { SavingsCELO } from "generated/SavingsCELO";
import { useAsyncState } from "./useAsyncState";
import { UbeswapPair } from "generated/UbeswapPair";

export const useExchange = () => {
  const { kit, network } = useContractKit();
  const [fromCurrency, setFromCurrency] = React.useState("CELO");
  const [toCurrency, setToCurrency] = React.useState("rCELO");
  const [fromAmount, setFromAmount] = React.useState("0");
  const [toAmount, setToAmount] = React.useState("0");

  // const exchangeCall = React.useCallback(() => {
  //   if (fromCurrency.toLowerCase() === "celo") {
  //     if (toCurrency.toLowerCase() === "rcelo") {
  //       const input = new TokenAmount(CELO[network.chainId], fromAmount);
  //       const output = new TokenAmount(CELO[network.chainId], toAmount);
  //       const pair = new Pair(input, output);
  //       const route = new Route([pair], input.token);
  //       const trade = new Trade(route, input, TradeType.EXACT_INPUT);
  //     } else {
  //       // use rewards kit
  //     }
  //   } else if (fromCurrency.toLowerCase() === "rcelo") {
  //     if (toCurrency.toLowerCase() === "celo") {
  //       // use ubeswap
  //     } else {
  //       // use ubeswap
  //     }
  //   } else {
  //     if (toCurrency.toLowerCase() === "celo") {
  //       // use ubeswap
  //     } else {
  //       // use rewards kit
  //     }
  //   }
  // }, []);

  const exchangeRateCall = React.useCallback(async () => {
    if (fromCurrency.toLowerCase() === "celo") {
      if (toCurrency.toLowerCase() === "rcelo") {
        const rCELO = new Token(
          (network.chainId as unknown) as ChainId,
          CURRENCY_MAP[network.chainId].rcelo,
          18
        ); // HARDCODE: decimals
        const pairAddress = Pair.getAddress(CELO[network.chainId], rCELO);
        const pairContract = (new kit.web3.eth.Contract(
          UbeswapPairAbi as AbiItem[],
          pairAddress
        ) as unknown) as UbeswapPair;

        const {
          reserve0,
          reserve1,
        } = await pairContract.methods.getReserves().call();
        const token0 = new TokenAmount(CELO[network.chainId], reserve0);
        const token1 = new TokenAmount(rCELO, reserve1);
        const pair = new Pair(token0, token1);
        const route = new Route([pair], token0.token, token1.token);
        return Trade.exactIn(
          route,
          new TokenAmount(CELO[network.chainId], toWei(fromAmount))
        )
          .executionPrice.invert()
          .toFixed();
      } else {
        const wrapped = (new kit.web3.eth.Contract(
          SavingsCELOAbi as AbiItem[],
          CURRENCY_MAP[network.chainId][toCurrency.toLowerCase()]
        ) as unknown) as SavingsCELO;
        return fromWei(await wrapped.methods.celoToSavings(toWei("1")).call());
      }
    } else if (fromCurrency.toLowerCase() === "rcelo") {
      if (toCurrency.toLowerCase() === "celo") {
        // use ubeswap
      } else {
        // use ubeswap
      }
    } else {
      if (toCurrency.toLowerCase() === "celo") {
        // use ubeswap
      } else {
        // use rewards kit
      }
    }
    return "0";
  }, [fromAmount, fromCurrency, toAmount, toCurrency, kit, network]);

  const [exchangeRate] = useAsyncState("0", exchangeRateCall);
  return {
    fromCurrency,
    setFromCurrency,
    fromAmount,
    setFromAmount: (amount: string) => {
      setFromAmount(amount);
      setToAmount((Number(amount) / Number(exchangeRate)).toString());
    },
    toCurrency,
    setToCurrency,
    toAmount,
    setToAmount: (amount: string) => {
      setToAmount(amount);
      setFromAmount((Number(amount) * Number(exchangeRate)).toString());
    },
    exchangeRate,
  };
};
