import { useContractKit } from "@ubeswap/use-contractkit";
import React from "react";

export function useLatestBlockNumber() {
  const { kit } = useContractKit();
  const [latestBlock, setLatestBlock] = React.useState(0);
  React.useEffect(() => {
    kit.web3.eth.getBlockNumber().then(setLatestBlock);
  }, [kit, setLatestBlock]);
  return latestBlock;
}
