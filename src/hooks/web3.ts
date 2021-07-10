import { useContractKit } from "@ubeswap/use-contractkit";
import React from "react";
import { useAsyncState } from "./useAsyncState";

export function useLatestBlockNumber(): [number, () => void] {
  const { kit } = useContractKit();
  const getBlockNumber = React.useCallback(async () => {
    return await kit.web3.eth.getBlockNumber();
  }, [kit]);
  return useAsyncState(0, getBlockNumber);
}
