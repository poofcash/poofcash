import React from "react";
import ReactDOM from "react-dom";
import theme from "theme";
import App from "App";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider, createWeb3ReactRoot } from "@web3-react/core";
import { Provider } from "react-redux";
import { ThemeProvider } from "theme-ui";
import { BrowserRouter } from "react-router-dom";
import store from "state";
import {
  Alfajores,
  ContractKitProvider,
  Mainnet,
} from "@ubeswap/use-contractkit";
import { ChainId } from "@ubeswap/sdk";
import { CHAIN_ID } from "config";
import { PasswordPrompt } from "hooks/poofAccount";
import { PoofKitGlobal } from "hooks/poofUtils";

import "@ubeswap/use-contractkit/lib/styles.css";
import "index.css";

declare global {
  interface Window {
    groth16: any;
  }
}

export const NetworkContextName = "NETWORK";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 15000;
  return library;
}

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <ContractKitProvider
                dappName="Poof.cash"
                dappDescription="Decentralized, private transactions for Celo"
                dappUrl={window.location.href.slice(
                  0,
                  window.location.href.length - 1
                )}
                networks={[CHAIN_ID === ChainId.MAINNET ? Mainnet : Alfajores]}
              >
                <PasswordPrompt.Provider>
                  <PoofKitGlobal.Provider>
                    <App />
                  </PoofKitGlobal.Provider>
                </PasswordPrompt.Provider>
              </ContractKitProvider>
            </BrowserRouter>
          </ThemeProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
