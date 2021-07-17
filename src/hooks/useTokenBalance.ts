import { useCallback, useMemo } from "react";
import ERC20_ABI from "abis/ERC20.json";
import { useContractKit } from "@celo-tools/use-contractkit";
import { AbiItem, isAddress } from "web3-utils";
import { useAsyncState } from "./useAsyncState";

export function useTokenBalance(tokenAddress: string, owner?: string | null) {
  const { kit } = useContractKit();
  const tokenContract = useMemo(() => {
    return new kit.web3.eth.Contract(
      (ERC20_ABI as unknown) as AbiItem,
      tokenAddress
    );
  }, [tokenAddress, kit]);

  const balanceCall = useCallback(async () => {
    if (!owner || !isAddress(owner)) {
      return "0";
    }
    return tokenContract.methods.balanceOf(owner).call();
  }, [owner, tokenContract]);

  const [balance] = useAsyncState("0", balanceCall);

  return balance;
}
