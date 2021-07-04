import React from "react";
import CompliancePage from "pages/CompliancePage";
import WithdrawPage from "pages/WithdrawPage";
import DepositPage from "pages/DepositPage";
import { Container, Flex, Link, Text } from "theme-ui";
import { Header } from "components/Header";
import "i18n/config";
import { useSelector } from "react-redux";
import { Page } from "state/global";
import { AppState } from "state";
import { PasswordPrompt } from "hooks/poofAccount";
import MinePage from "pages/MinePage";
import RedeemPage from "pages/RedeemPage";
import { SetupAccount } from "pages/SetupAccount";
import AirdropPage from "pages/AirdropPage";
import ExchangePage from "pages/ExchangePage";
import { CHAIN_ID, MINE_START } from "config";
import { Countdown } from "components/Countdown";
import Modal from "react-modal";

// pass props and State interface to Component class
const App: React.FC = () => {
  const { passwordModal } = PasswordPrompt.useContainer();
  React.useEffect(() => {
    Modal.setAppElement("body");
  });

  const currentPage = useSelector(
    (state: AppState) => state.global.currentPage
  );

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
  } else if (currentPage === Page.AIRDROP) {
    page = <AirdropPage />;
  } else if (currentPage === Page.EXCHANGE) {
    page = <ExchangePage />;
  }

  const currentTime = Math.round(Date.now() / 1000);
  if (CHAIN_ID === 42220 && currentTime < MINE_START) {
    if (
      currentPage === Page.MINE ||
      currentPage === Page.REDEEM ||
      currentPage === Page.AIRDROP
    ) {
      let title = "Mining";
      if (currentPage === Page.REDEEM) {
        title = "Redemption";
      } else if (currentPage === Page.AIRDROP) {
        title = "Airdrop";
      }
      page = (
        <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
          <Text variant="title">{title} begins in</Text>
          <Countdown start={MINE_START - 1209600} end={MINE_START} />
          <Text mt={4}>
            Tune in to updates on{" "}
            <Link
              href="https://twitter.com/Poofcash"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </Link>
          </Text>
        </Flex>
      );
    }
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
