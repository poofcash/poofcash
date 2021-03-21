import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { Web3Provider } from "@ethersproject/providers";
import { ChainId } from "@ubeswap/sdk";
import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "index";
import { CHAIN_ID } from "config";

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & {
  chainId: ChainId;
} {
  const context = useWeb3React<Web3Provider>();
  const contextNetwork = useWeb3React<Web3Provider>(NetworkContextName);
  return {
    ...(context.active ? context : contextNetwork),
    chainId: CHAIN_ID,
  };
}
