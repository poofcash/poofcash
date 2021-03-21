import { Web3Provider } from "@ethersproject/providers";
import { ChainId } from "@ubeswap/sdk";
import { InjectedConnector } from "@ubeswap/injected-connector";
import { LedgerConnector } from "./ledger/LedgerConnector";
import { NetworkConnector } from "./NetworkConnector";
import { ValoraConnector } from "./valora/ValoraConnector";
import { CHAIN_ID } from "config";

export const network = new NetworkConnector({
  defaultChainId: CHAIN_ID,
});

let networkLibrary: Web3Provider | undefined;
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary =
    networkLibrary ?? new Web3Provider(network.provider as any));
}

export const injected = new InjectedConnector({
  supportedChainIds: [ChainId.ALFAJORES, ChainId.BAKLAVA, ChainId.MAINNET],
});

export const ledger = new LedgerConnector();

export const valora = new ValoraConnector({
  defaultChainId: CHAIN_ID,
});
