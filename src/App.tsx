import React from "react";
import CompliancePage from "pages/CompliancePage";
import WithdrawPage from "pages/WithdrawPage";
import DepositPage from "pages/DepositPage";
import { Container } from "theme-ui";
import { network } from "connectors";
import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "index";
import { useInitValoraResponse } from "connectors/valora/valoraUtils";
import Modal from "react-modal";
import { Header } from "components/Header";
import "i18n/config";
import { useSelector } from "react-redux";
import { Page } from "state/global";
import { AppState } from "state";

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

  const currentPage = useSelector(
    (state: AppState) => state.global.currentPage
  );

  let page = <DepositPage />;
  if (currentPage === Page.WITHDRAW) {
    page = <WithdrawPage />;
  } else if (currentPage === Page.COMPLIANCE) {
    page = <CompliancePage />;
  }

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
        {page}
      </Container>
      {/*TODO footer*/}
    </Container>
  );
};

export default App;
