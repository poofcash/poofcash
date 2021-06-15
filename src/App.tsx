import React from "react";
import CompliancePage from "pages/CompliancePage";
import WithdrawPage from "pages/WithdrawPage";
import DepositPage from "pages/DepositPage";
import { Container } from "theme-ui";
import { network } from "connectors";
import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "index";
import Modal from "react-modal";
import { Header } from "components/Header";
import "i18n/config";
import { useDispatch, useSelector } from "react-redux";
import { Page, setCurrentPage } from "state/global";
import { AppState } from "state";
import { PasswordPrompt } from "hooks/poofAccount";
import MinePage from "pages/MinePage";
import RedeemPage from "pages/RedeemPage";
import { SetupAccount } from "pages/SetupAccount";

// pass props and State interface to Component class
const App = () => {
  const { activate: activateNetwork, library } = useWeb3React(
    NetworkContextName
  );
  React.useEffect(() => {
    Modal.setAppElement("body");
    if (!library) {
      activateNetwork(network);
    }
  }, [library, activateNetwork]);

  const { passwordModal } = PasswordPrompt.useContainer();

  const currentPage = useSelector(
    (state: AppState) => state.global.currentPage
  );

  const poofAccount = useSelector((state: AppState) => state.user.poofAccount);
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (poofAccount) {
      dispatch(setCurrentPage({ nextPage: Page.DEPOSIT }));
    }
  }, [poofAccount, dispatch]);

  let page = <DepositPage />;
  if (currentPage === Page.WITHDRAW) {
    page = <WithdrawPage />;
  } else if (currentPage === Page.COMPLIANCE) {
    page = <CompliancePage />;
  } else if (currentPage === Page.MINE) {
    page = <MinePage />;
  } else if (currentPage === Page.REDEEM) {
    page = <RedeemPage />;
  } else if (currentPage === Page.SETUP) {
    page = <SetupAccount />;
  }

  return (
    <>
      <Container
        sx={{
          mx: [0, "15%"],
          my: [0, 4],
          maxWidth: "100%",
          width: "auto",
        }}
      >
        {currentPage === Page.SETUP ? (
          <SetupAccount />
        ) : (
          <>
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
          </>
        )}
        {/*TODO footer*/}
      </Container>
      {passwordModal}
    </>
  );
};

export default App;
