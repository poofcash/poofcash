import React from "react";
import CompliancePage from "pages/CompliancePage";
import WithdrawPage from "pages/WithdrawPage";
import DepositPage from "pages/DepositPage";
import { Container } from "theme-ui";
import { network } from "connectors";
import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "index";
import { useInitValoraResponse } from "connectors/valora/valoraUtils";
import { Switch, Route, Redirect } from "react-router-dom";
import Modal from "react-modal";
import { Header } from "components/Header";
import "i18n/config";

// pass props and State interface to Component class
const App = () => {
  useInitValoraResponse();
  const { activate: activateNetwork, library } = useWeb3React(
    NetworkContextName
  );
  React.useEffect(() => {
    Modal.setAppElement("body");
    if (!library) {
      activateNetwork(network);
    }
  }, [library, activateNetwork]);

  return (
    <Container
      sx={{
        mx: [0, "15%"],
        my: [0, 4],
        maxWidth: "100%",
        width: "auto",
      }}
    >
      <Header />
      <Container
        sx={{
          px: [3, 0],
          py: [4, 0],
          mb: "64px",
          maxHeight: "calc(100vh + 64px)",
        }}
      >
        <Switch>
          <Route exact path="/">
            <Redirect to="/deposit" />
          </Route>
          <Route exact path="/deposit">
            <DepositPage />
          </Route>
          <Route exact path="/withdraw">
            <WithdrawPage />
          </Route>
          <Route exact path="/compliance">
            <CompliancePage />
          </Route>
        </Switch>
      </Container>
      {/*TODO footer*/}
    </Container>
  );
};

export default App;
