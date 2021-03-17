import { Web3Provider } from "@ethersproject/providers";
import { ChainId, parseNetwork } from "@ubeswap/sdk";
import { InjectedConnector } from "@ubeswap/injected-connector";
import { LedgerConnector } from "./ledger/LedgerConnector";
import { NetworkConnector } from "./NetworkConnector";

export const NETWORK_CHAIN_ID: ChainId = process.env.REACT_APP_CHAIN_ID
  ? parseNetwork(parseInt(process.env.REACT_APP_CHAIN_ID))
  : ChainId.ALFAJORES; // TODO update

export const network = new NetworkConnector({
  defaultChainId: NETWORK_CHAIN_ID,
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
