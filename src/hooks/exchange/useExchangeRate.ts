import React from "react";
import { CELO, TokenAmount, Token, ChainId } from "@ubeswap/sdk";
import { AbiItem, fromWei, toBN, toWei } from "web3-utils";
import RewardsCELOAbi from "abis/RewardsCELO.json";
import SavingsCELOAbi from "abis/SavingsCELO.json";
import { CURRENCY_MAP } from "config";
import { SavingsCELO } from "generated/SavingsCELO";
import { useAsyncState } from "hooks/useAsyncState";
import { getUbeswapTrade } from "utils/getUbeswapTrade";
import { useContractKit } from "@celo-tools/use-contractkit";
import { RewardsCELO } from "generated/RewardsCELO";

export const useExchangeRate = (
  fromCurrency: string,
  toCurrency: string,
  fromAmount: string
) => {
  const { network, kit } = useContractKit();

  const exchangeRateCall = React.useCallback(async () => {
    if (fromCurrency.toLowerCase() === "celo") {
      if (toCurrency.toLowerCase() === "rcelo") {
        const rCELO = new Token(
          (network.chainId as unknown) as ChainId,
          CURRENCY_MAP[network.chainId].rcelo,
          18
        );
        return (
          await getUbeswapTrade(
            kit,
            rCELO,
            CELO[network.chainId],
            new TokenAmount(CELO[network.chainId], toWei(fromAmount))
          )
        ).executionPrice.toSignificant(6);
      } else {
        const wrapped = (new kit.web3.eth.Contract(
          SavingsCELOAbi as AbiItem[],
          CURRENCY_MAP[network.chainId][toCurrency.toLowerCase()]
        ) as unknown) as SavingsCELO;
        return fromWei(await wrapped.methods.celoToSavings(toWei("1")).call());
      }
    } else if (fromCurrency.toLowerCase() === "rcelo") {
      const rCELO = new Token(
        (network.chainId as unknown) as ChainId,
        CURRENCY_MAP[network.chainId].rcelo,
        18
      );

      if (toCurrency.toLowerCase() === "celo") {
        return (
          await getUbeswapTrade(
            kit,
            rCELO,
            CELO[network.chainId],
            new TokenAmount(rCELO, toWei(fromAmount))
          )
        ).executionPrice.toSignificant(6);
      } else {
        // Ubeswap in the future //

        // const wrapped = new Token(
        //   (network.chainId as unknown) as ChainId,
        //   CURRENCY_MAP[network.chainId][fromCurrency.toLowerCase()],
        //   18
        // ); // HARDCODE: decimals
        // return (
        //   await getUbeswapTrade(
        //   kit,
        //     wrapped,
        //     rCELO,
        //     new TokenAmount(rCELO, toWei(fromAmount))
        //   )
        // ).executionPrice.toSignificant(6);
        return "1";
      }
    } else {
      const wrapped = new Token(
        (network.chainId as unknown) as ChainId,
        CURRENCY_MAP[network.chainId][fromCurrency.toLowerCase()],
        18
      );
      if (toCurrency.toLowerCase() === "celo") {
        return (
          await getUbeswapTrade(
            kit,
            wrapped,
            CELO[network.chainId],
            new TokenAmount(wrapped, toWei(fromAmount))
          )
        ).executionPrice.toSignificant(6);
      } else {
        const rewardsCELO = (new kit.web3.eth.Contract(
          RewardsCELOAbi as AbiItem[],
          CURRENCY_MAP[network.chainId].rcelo
        ) as unknown) as RewardsCELO;
        const wrappedCELO = (new kit.web3.eth.Contract(
          SavingsCELOAbi as AbiItem[],
          CURRENCY_MAP[network.chainId][fromCurrency.toLowerCase()]
        ) as unknown) as RewardsCELO;
        const totalSupplyCELO = await rewardsCELO.methods
          .getTotalSupplyCELO()
          .call();
        const totalSupply = await rewardsCELO.methods.totalSupply().call();
        const celoToAdd = await wrappedCELO.methods
          .savingsToCELO(toWei(fromAmount))
          .call();
        const toMint = fromWei(
          toBN(celoToAdd).mul(toBN(totalSupply)).div(toBN(totalSupplyCELO))
        );
        return (Number(toMint) / Number(fromAmount)).toPrecision(4);
      }
    }
  }, [fromAmount, fromCurrency, toCurrency, kit, network]);

  return useAsyncState("0", exchangeRateCall);
};
