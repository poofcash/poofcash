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
          <Box
            sx={{
              display: currentPage === Page.DEPOSIT ? "inherit" : "none",
            }}
          >
            <DepositPage />
          </Box>
          <Box
            sx={{
              display: currentPage === Page.WITHDRAW ? "inherit" : "none",
            }}
          >
            <WithdrawPage />
          </Box>
          <Box
            sx={{
              display: currentPage === Page.COMPLIANCE ? "inherit" : "none",
            }}
          >
            <CompliancePage />
          </Box>
          <Box sx={{ display: currentPage === Page.MINE ? "inherit" : "none" }}>
            <MinePage />
          </Box>
          <Box
            sx={{
              display: currentPage === Page.REDEEM ? "inherit" : "none",
            }}
          >
            <RedeemPage />
          </Box>
          <Box
            sx={{
              display: currentPage === Page.SETUP ? "inherit" : "none",
            }}
          >
            <SetupAccount />
          </Box>
          <Box
            sx={{
              display: currentPage === Page.AIRDROP ? "inherit" : "none",
            }}
          >
            <AirdropPage />
          </Box>
          <Box
            sx={{
              display: currentPage === Page.EXCHANGE ? "inherit" : "none",
            }}
          >
            <ExchangePage />
          </Box>
        </Container>
        {/*TODO footer*/}
      </Container>
      {passwordModal}
    </>
  );
};

export default App;
