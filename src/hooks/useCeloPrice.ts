import React from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { fromWei, toWei } from "web3-utils";
import { useAsyncState } from "hooks/useAsyncState";

export const useCeloPrice = () => {
  const { kit } = useContractKit();

  const priceCall = React.useCallback(async () => {
    const exchange = await kit.contracts.getExchange();
    return Number(
      fromWei((await exchange.quoteGoldSell(toWei("1"))).toString())
    );
  }, [kit]);

  return useAsyncState(0, priceCall);
};
