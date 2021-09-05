import React from "react";
import "i18n/config";
import CompliancePage from "pages/CompliancePage";
import WithdrawPage from "pages/WithdrawPage";
import DepositPage from "pages/DepositPage";
import { Box, Container } from "theme-ui";
import { Header } from "components/Header";
import { Page } from "state/global";
import MinePage from "pages/MinePage";
import RedeemPage from "pages/RedeemPage";
import { SetupAccount } from "pages/SetupAccount";
import AirdropPage from "pages/AirdropPage";
import ExchangePage from "pages/ExchangePage";
import Modal from "react-modal";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { ToastContainer } from "react-toastify";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { WalletDrawer } from "components/Wallet/WalletDrawer";
import { PoofAccountDrawer } from "components/PoofAccount/PoofAccountDrawer";
import RefundPage from "pages/RefundPage";

// pass props and State interface to Component class
const App: React.FC = () => {
  const { passwordModal } = PoofAccountGlobal.useContainer();
  React.useEffect(() => {
    Modal.setAppElement("body");
  });
  const location = useLocation();

  return (
    <>
      <Container
        sx={{
          mx: [0, "5%"],
          my: [0, 4],
          maxWidth: "100%",
          width: "auto",
        }}
      >
        <Box
          sx={{
            display: location.pathname.includes(Page.SETUP)
              ? "none"
              : "inherit",
          }}
        >
          <Header />
        </Box>
        <Container
          sx={{
            px: [3, 0],
            py: location.pathname.includes(Page.SETUP) ? [0, 0] : [4, "5%"],
            mb: "64px",
            maxHeight: "calc(100vh + 64px)",
          }}
        >
          <Switch>
            <Route exact path="/">
              <Redirect to={`/${Page.DEPOSIT}`} />
            </Route>
            <Route exact path={`/${Page.DEPOSIT}`}>
              <DepositPage />
            </Route>
            <Route exact path={`/${Page.WITHDRAW}`}>
              <WithdrawPage />
            </Route>
            <Route exact path={`/${Page.COMPLIANCE}`}>
              <CompliancePage />
            </Route>
            <Route exact path={`/${Page.MINE}`}>
              <MinePage />
            </Route>
            <Route exact path={`/${Page.REDEEM}`}>
              <RedeemPage />
            </Route>
            <Route exact path={`/${Page.REFUND}`}>
              <RefundPage />
            </Route>
            <Route path={`/${Page.SETUP}`}>
              <SetupAccount />
            </Route>
            <Route exact path={`/${Page.AIRDROP}`}>
              <AirdropPage />
            </Route>
            <Route exact path={`/${Page.EXCHANGE}`}>
              <ExchangePage />
            </Route>
          </Switch>
        </Container>
      </Container>
      {passwordModal}
      <ToastContainer
        style={{ background: "var(--theme-ui-colors-background)" }}
        toastClassName="toast-body"
        bodyClassName="toast-body"
      />
      <WalletDrawer />
      <PoofAccountDrawer />
    </>
  );
};

export default App;
