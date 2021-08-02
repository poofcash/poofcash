import React from "react";
import ERC20Abi from "abis/ERC20.json";
import { ERC20 } from "generated/ERC20";
import { MaxUint256 } from "@ethersproject/constants";
import { useContractKit } from "@celo-tools/use-contractkit";
import { CELO } from "@ubeswap/sdk";
import { CURRENCY_MAP, UBESWAP_ROUTER } from "config";
import { AbiItem, toWei } from "web3-utils";
import { toastTx } from "utils/toastTx";

export const useExchangeApprove = (
  fromCurrency: string,
  toCurrency: string
) => {
  const { network, getConnectedKit, connect } = useContractKit();
  return React.useCallback(async () => {
    const kit = await getConnectedKit();
    if (!kit.defaultAccount) {
      connect();
      return;
    }

    const txOptions = {
      from: kit.defaultAccount,
      gasPrice: toWei("0.13", "gwei"),
    };

    if (fromCurrency.toLowerCase() === "celo") {
      if (toCurrency.toLowerCase() === "rcelo") {
        const celo = (new kit.web3.eth.Contract(
          ERC20Abi as AbiItem[],
          CELO[network.chainId].address
        ) as unknown) as ERC20;
        const tx = await celo.methods
          .approve(UBESWAP_ROUTER, MaxUint256.toString())
          .send(txOptions);
        toastTx(tx.transactionHash);
      } else {
        return;
      }
    } else if (fromCurrency.toLowerCase() === "rcelo") {
      const rCelo = new kit.web3.eth.Contract(
        ERC20Abi as AbiItem[],
        CURRENCY_MAP[network.chainId].rcelo
      );
      const tx = await rCelo.methods
        .approve(UBESWAP_ROUTER, MaxUint256.toString())
        .send(txOptions);
      toastTx(tx.transactionHash);
    } else {
      const wrappedAddress =
        CURRENCY_MAP[network.chainId][fromCurrency.toLowerCase()];
      const wrapped = (new kit.web3.eth.Contract(
        ERC20Abi as AbiItem[],
        wrappedAddress
      ) as unknown) as ERC20;
      if (toCurrency.toLowerCase() === "celo") {
        const tx = await wrapped.methods
          .approve(UBESWAP_ROUTER, MaxUint256.toString())
          .send(txOptions);
        toastTx(tx.transactionHash);
      } else {
        const tx = await wrapped.methods
          .approve(CURRENCY_MAP[network.chainId].rcelo, MaxUint256.toString())
          .send(txOptions);
        toastTx(tx.transactionHash);
      }
    }
  }, [fromCurrency, network, toCurrency, connect, getConnectedKit]);
};
