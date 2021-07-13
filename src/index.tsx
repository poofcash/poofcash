import React from "react";
import ReactDOM from "react-dom";
import theme from "theme";
import App from "App";
import { Provider } from "react-redux";
import { ThemeProvider } from "theme-ui";
import { BrowserRouter } from "react-router-dom";
import store from "state";
import { ContractKitProvider } from "@celo-tools/use-contractkit";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { DepositListGlobal } from "components/DepositList";

import "@celo-tools/use-contractkit/lib/styles.css";
import "index.css";

declare global {
  interface Window {
    groth16: any;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ContractKitProvider
            dapp={{
              name: "Poof.cash",
              description: "Decentralized, private transactions for Celo",
              url: "https://app.poof.cash",
            }}
          >
            <PoofKitGlobal.Provider>
              <PoofAccountGlobal.Provider>
                <DepositListGlobal.Provider>
                  <App />
                </DepositListGlobal.Provider>
              </PoofAccountGlobal.Provider>
            </PoofKitGlobal.Provider>
          </ContractKitProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
