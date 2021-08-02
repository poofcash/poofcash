import React from "react";
import ERC20Abi from "abis/ERC20.json";
import { ERC20 } from "generated/ERC20";
import { MaxUint256 } from "@ethersproject/constants";
import { useContractKit } from "@celo-tools/use-contractkit";
import { CELO } from "@ubeswap/sdk";
import { CURRENCY_MAP, UBESWAP_ROUTER } from "config";
import { AbiItem } from "web3-utils";
import { useAsyncState } from "hooks/useAsyncState";

export const useExchangeAllowance = (
  fromCurrency: string,
  toCurrency: string
) => {
  const { kit, network, address } = useContractKit();
  const allowanceCall = React.useCallback(async () => {
    if (!address) {
      return "0";
    }
    if (fromCurrency.toLowerCase() === "celo") {
      if (toCurrency.toLowerCase() === "rcelo") {
        const celo = (new kit.web3.eth.Contract(
          ERC20Abi as AbiItem[],
          CELO[network.chainId].address
        ) as unknown) as ERC20;
        return await celo.methods.allowance(address, UBESWAP_ROUTER).call();
      } else {
        return MaxUint256.toString();
      }
    } else if (fromCurrency.toLowerCase() === "rcelo") {
      const rCelo = new kit.web3.eth.Contract(
        ERC20Abi as AbiItem[],
        CURRENCY_MAP[network.chainId].rcelo
      );
      return await rCelo.methods.allowance(address, UBESWAP_ROUTER).call();
    } else {
      const wrappedAddress =
        CURRENCY_MAP[network.chainId][fromCurrency.toLowerCase()];
      const wrapped = (new kit.web3.eth.Contract(
        ERC20Abi as AbiItem[],
        wrappedAddress
      ) as unknown) as ERC20;
      if (toCurrency.toLowerCase() === "celo") {
        return await wrapped.methods.allowance(address, UBESWAP_ROUTER).call();
      } else {
        return await wrapped.methods
          .allowance(address, CURRENCY_MAP[network.chainId].rcelo)
          .call();
      }
    }
  }, [fromCurrency, network, toCurrency, address, kit]);
  return useAsyncState("0", allowanceCall);
};
