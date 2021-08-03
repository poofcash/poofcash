import { useContractKit } from "@celo-tools/use-contractkit";
import { CELO, Percent, Token, TokenAmount, ChainId } from "@ubeswap/sdk";
import React from "react";
import { getUbeswapTrade } from "utils/getUbeswapTrade";
import { AbiItem, toWei } from "web3-utils";
import UbeswapRouterAbi from "abis/UbeswapRouter.json";
import RewardsCELOAbi from "abis/RewardsCELO.json";
import SavingsCELOAbi from "abis/SavingsCELO.json";
import { CURRENCY_MAP, rCELOMap, UBESWAP_ROUTER } from "config";
import { UbeswapRouter } from "generated/UbeswapRouter";
import { RewardsCELO } from "generated/RewardsCELO";
import { SavingsCELO } from "generated/SavingsCELO";

const SLIPPAGE_TOLERANCE = new Percent("50", "10000");

export const useExchangeCall = (
  fromCurrency: string,
  toCurrency: string,
  fromAmount: string
) => {
  const { getConnectedKit, connect, network } = useContractKit();

  return React.useCallback(async () => {
    const kit = await getConnectedKit();
    if (!kit.defaultAccount) {
      connect();
      return;
    }
    const swap = async (fromToken: Token, toToken: Token, account: string) => {
      const trade = await getUbeswapTrade(
        kit,
        fromToken,
        toToken,
        new TokenAmount(fromToken, toWei(fromAmount))
      );
      const router = (new kit.web3.eth.Contract(
        UbeswapRouterAbi as AbiItem[],
        UBESWAP_ROUTER
      ) as unknown) as UbeswapRouter;
      const tx = await router.methods
        .swapExactTokensForTokens(
          toWei(trade.inputAmount.toExact()),
          toWei(trade.minimumAmountOut(SLIPPAGE_TOLERANCE).toExact()),
          [fromToken.address, toToken.address],
          account,
          Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
        )
        .send({ from: account, gasPrice: toWei("0.13", "gwei") });
      return tx.transactionHash;
    };

    if (fromCurrency.toLowerCase() === "celo") {
      if (toCurrency.toLowerCase() === "rcelo") {
        const rCELO = new Token(
          (network.chainId as unknown) as ChainId,
          CURRENCY_MAP[network.chainId].rcelo,
          18
        );
        return swap(CELO[network.chainId], rCELO, kit.defaultAccount);
      } else {
        const wrapped = (new kit.web3.eth.Contract(
          SavingsCELOAbi as AbiItem[],
          CURRENCY_MAP[network.chainId][toCurrency.toLowerCase()]
        ) as unknown) as SavingsCELO;
        const tx = await wrapped.methods.deposit().send({
          from: kit.defaultAccount,
          gasPrice: toWei("0.13", "gwei"),
          value: toWei(fromAmount),
        });
        return tx.transactionHash;
      }
    } else if (fromCurrency.toLowerCase() === "rcelo") {
      const rCELO = new Token(
        (network.chainId as unknown) as ChainId,
        CURRENCY_MAP[network.chainId].rcelo,
        18
      );

      if (toCurrency.toLowerCase() === "celo") {
        return swap(rCELO, CELO[network.chainId], kit.defaultAccount);
      } else {
        // Ubeswap in the future //

        // const wrapped = new Token(
        //   (network.chainId as unknown) as ChainId,
        //   CURRENCY_MAP[network.chainId][fromCurrency.toLowerCase()],
        //   18
        // ); // HARDCODE: decimals
        // swap(rCELO, wrapped, kit.defaultAccount);
        const rewards = (new kit.web3.eth.Contract(
          RewardsCELOAbi as AbiItem[],
          CURRENCY_MAP[network.chainId].rcelo
        ) as unknown) as RewardsCELO;
        const tx = await rewards.methods
          .withdraw(toWei(fromAmount))
          .send({ from: kit.defaultAccount, gasPrice: toWei("0.13", "gwei") });
        return tx.transactionHash;
      }
    } else {
      const wrapped = new Token(
        (network.chainId as unknown) as ChainId,
        CURRENCY_MAP[network.chainId][fromCurrency.toLowerCase()],
        18
      );
      if (toCurrency.toLowerCase() === "celo") {
        return swap(wrapped, CELO[network.chainId], kit.defaultAccount);
      } else {
        const rewards = (new kit.web3.eth.Contract(
          RewardsCELOAbi as AbiItem[],
          CURRENCY_MAP[network.chainId].rcelo
        ) as unknown) as RewardsCELO;
        const tx = await rewards.methods
          .deposit(
            toWei(fromAmount),
            rCELOMap[network.chainId][fromCurrency.toLowerCase()]
          )
          .send({ from: kit.defaultAccount, gasPrice: toWei("0.13", "gwei") });
        return tx.transactionHash;
      }
    }
  }, [connect, fromAmount, fromCurrency, getConnectedKit, network, toCurrency]);
};
