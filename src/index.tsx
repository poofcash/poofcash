import React from "react";
import ReactDOM from "react-dom";
import theme from "theme";
import App from "App";
import { Provider } from "react-redux";
import { ThemeProvider } from "theme-ui";
import { HashRouter as Router } from "react-router-dom";
import store from "state";
import { ContractKitProvider } from "@celo-tools/use-contractkit";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { DepositListGlobal } from "components/DepositList";
import { RecoilRoot } from "recoil";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

import "@celo-tools/use-contractkit/lib/styles.css";
import "react-toastify/dist/ReactToastify.min.css";
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
        <RecoilRoot>
          <Router>
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
          </Router>
        </RecoilRoot>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
