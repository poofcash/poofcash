import React from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import UbeswapPairABI from "abis/UbeswapPair.json";
import { UbeswapPair } from "generated/UbeswapPair";
import { AbiItem, fromWei } from "web3-utils";
import { useAsyncState } from "hooks/useAsyncState";
import { useCeloPrice } from "hooks/useCeloPrice";

export const useRCeloPrice = () => {
  const { kit } = useContractKit();

  const [celoPrice] = useCeloPrice();

  const priceCall = React.useCallback(async () => {
    const rceloCeloPair = (new kit.web3.eth.Contract(
      UbeswapPairABI as AbiItem[],
      "0x58fff7110e39c733fd37742b8850f9205fbc351b"
    ) as unknown) as UbeswapPair;

    const {
      reserve0: rceloReserve,
      reserve1: celoReserve,
    } = await rceloCeloPair.methods.getReserves().call();

    const rceloPerCelo =
      Number(fromWei(rceloReserve)) / Number(fromWei(celoReserve));
    return celoPrice / rceloPerCelo;
  }, [kit, celoPrice]);

  return useAsyncState(0, priceCall);
};
