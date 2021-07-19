import React from "react";
import CompliancePage from "pages/CompliancePage";
import WithdrawPage from "pages/WithdrawPage";
import DepositPage from "pages/DepositPage";
import { Box, Container } from "theme-ui";
import { Header } from "components/Header";
import "i18n/config";
import { useSelector } from "react-redux";
import { Page } from "state/global";
import { AppState } from "state";
import MinePage from "pages/MinePage";
import RedeemPage from "pages/RedeemPage";
import { SetupAccount } from "pages/SetupAccount";
import AirdropPage from "pages/AirdropPage";
import ExchangePage from "pages/ExchangePage";
import Modal from "react-modal";
import { PoofAccountGlobal } from "hooks/poofAccount";
import StakePage from "pages/StakePage";
import { ToastContainer } from "react-toastify";

const PageComponent: React.FC<{ page: Page; Component: React.FC }> = ({
  page,
  Component,
}) => {
  const currentPage = useSelector(
    (state: AppState) => state.global.currentPage
  );
  return (
    <Box
      sx={{
        display: currentPage === page ? "inherit" : "none",
      }}
    >
      <Component />
    </Box>
  );
};

// pass props and State interface to Component class
const App: React.FC = () => {
  const { passwordModal } = PoofAccountGlobal.useContainer();
  React.useEffect(() => {
    Modal.setAppElement("body");
  });

  const currentPage = useSelector(
    (state: AppState) => state.global.currentPage
  );

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
        <Box
          sx={{
            display: currentPage === Page.SETUP ? "none" : "inherit",
          }}
        >
          <Header />
        </Box>
        <Container
          sx={{
            px: [3, 0],
            py: [4, 0],
            mb: "64px",
            maxHeight: "calc(100vh + 64px)",
          }}
        >
          <PageComponent page={Page.DEPOSIT} Component={DepositPage} />
          <PageComponent page={Page.WITHDRAW} Component={WithdrawPage} />
          <PageComponent page={Page.COMPLIANCE} Component={CompliancePage} />
          <PageComponent page={Page.MINE} Component={MinePage} />
          <PageComponent page={Page.REDEEM} Component={RedeemPage} />
          <PageComponent page={Page.SETUP} Component={SetupAccount} />
          <PageComponent page={Page.AIRDROP} Component={AirdropPage} />
          <PageComponent page={Page.EXCHANGE} Component={ExchangePage} />
          <PageComponent page={Page.STAKE} Component={StakePage} />
        </Container>
        {/*TODO footer*/}
      </Container>
      {passwordModal}
      <ToastContainer
        style={{ background: "var(--theme-ui-colors-background)" }}
        toastClassName="toast-body"
        bodyClassName="toast-body"
      />
    </>
  );
};

export default App;
