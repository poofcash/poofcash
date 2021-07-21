import React from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import UbeswapPairABI from "abis/UbeswapPair.json";
import { UbeswapPair } from "generated/UbeswapPair";
import { AbiItem, fromWei } from "web3-utils";
import { useAsyncState } from "hooks/useAsyncState";
import { useUbePrice } from "hooks/useUbePrice";
import { usePoofPrice } from "hooks/usePoofPrice";

export const usePoofUbeStake = (amount: string) => {
  const { kit } = useContractKit();

  const [ubePrice] = useUbePrice();
  const [poofPrice] = usePoofPrice();

  const priceCall = React.useCallback(async () => {
    const poofUbePair = (new kit.web3.eth.Contract(
      UbeswapPairABI as AbiItem[],
      "0x573bcebd09ff805ed32df2cb1a968418dc74dcf7"
    ) as unknown) as UbeswapPair;

    const {
      reserve0: poofReserve,
      reserve1: ubeReserve,
    } = await poofUbePair.methods.getReserves().call();
    const totalSupply = await poofUbePair.methods.totalSupply().call();
    const ownership = Number(fromWei(amount)) / Number(fromWei(totalSupply));

    const ubeStake = ownership * Number(fromWei(ubeReserve)) * ubePrice;
    const poofStake = ownership * Number(fromWei(poofReserve)) * poofPrice;

    return ubeStake + poofStake;
  }, [kit, ubePrice, poofPrice, amount]);

  return useAsyncState(0, priceCall);
};
