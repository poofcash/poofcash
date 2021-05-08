import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@ubeswap/injected-connector";
import { NetworkConnector } from "connectors/NetworkConnector";
import { ValoraConnector } from "connectors/valora/ValoraConnector";
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
  supportedChainIds: [CHAIN_ID],
});

export const valora = new ValoraConnector({
  defaultChainId: CHAIN_ID,
});
