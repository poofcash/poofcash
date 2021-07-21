import React from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import UbeswapPairABI from "abis/UbeswapPair.json";
import { UbeswapPair } from "generated/UbeswapPair";
import { AbiItem, fromWei } from "web3-utils";
import { useAsyncState } from "hooks/useAsyncState";

export const useUbePrice = () => {
  const { kit } = useContractKit();

  const priceCall = React.useCallback(async () => {
    const ubeUSDPair = (new kit.web3.eth.Contract(
      UbeswapPairABI as AbiItem[],
      "0x59b22100751b7fda0c88201fb7a0eaf6fc30bcc7"
    ) as unknown) as UbeswapPair;

    const {
      reserve0: ubeReserve,
      reserve1: usdReserve,
    } = await ubeUSDPair.methods.getReserves().call();

    return Number(fromWei(usdReserve)) / Number(fromWei(ubeReserve));
  }, [kit]);

  return useAsyncState(0, priceCall);
};
