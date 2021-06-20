import React from "react";
import { Link } from "react-router-dom";
import { Container, Flex, Text } from "theme-ui";
import { Logo } from "components/Logo";
import { AccountProfile } from "components/AccountProfile";
import styled from "@emotion/styled";
import { ConnectWallet } from "pages/ConnectWallet";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "state";
import { Page, setCurrentPage } from "state/global";

const StyledLink = styled(Link)({
  height: "fit-content",
  textDecoration: "none",
});

export const DesktopHeader: React.FC = () => {
  const currentPage = useSelector(
    (state: AppState) => state.global.currentPage
  );
  const dispatch = useDispatch();
  const [showConnectWalletModal, setShowConnectWalletModal] = React.useState(
    false
  );

  return (
    <>
      <Container sx={{ width: "auto" }}>
        <Flex
          sx={{
            mb: 2,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Logo />
          <Flex
            sx={{
              alignItems: "center",
            }}
          >
            <StyledLink
              to=""
              onClick={() =>
                dispatch(setCurrentPage({ nextPage: Page.DEPOSIT }))
              }
            >
              <Text
                sx={{
                  color: currentPage === Page.DEPOSIT ? "accent" : "text",
                  mx: 1,
                }}
                variant="subtitle"
              >
                Deposit
              </Text>
            </StyledLink>
            <Text>/</Text>
            <StyledLink
              to=""
              onClick={() =>
                dispatch(setCurrentPage({ nextPage: Page.WITHDRAW }))
              }
            >
              <Text
                sx={{
                  color: currentPage === Page.WITHDRAW ? "accent" : "text",
                  mx: 1,
                }}
                variant="subtitle"
              >
                Withdraw
              </Text>
            </StyledLink>
            <Text>/</Text>
            <StyledLink
              to=""
              onClick={() => dispatch(setCurrentPage({ nextPage: Page.MINE }))}
            >
              <Text
                sx={{
                  color: currentPage === Page.MINE ? "accent" : "text",
                  mx: 1,
                }}
                variant="subtitle"
              >
                Mine
              </Text>
            </StyledLink>
            <Text>/</Text>
            <StyledLink
              to=""
              onClick={() =>
                dispatch(setCurrentPage({ nextPage: Page.REDEEM }))
              }
            >
              <Text
                sx={{
                  color: currentPage === Page.REDEEM ? "accent" : "text",
                  mx: 1,
                }}
                variant="subtitle"
              >
                Redeem
              </Text>
            </StyledLink>
            <Text>/</Text>
            <StyledLink
              to=""
              onClick={() =>
                dispatch(setCurrentPage({ nextPage: Page.COMPLIANCE }))
              }
            >
              <Text
                sx={{
                  color: currentPage === Page.COMPLIANCE ? "accent" : "text",
                  mx: 1,
                }}
                variant="subtitle"
              >
                Report
              </Text>
            </StyledLink>
            <Text>/</Text>
            <StyledLink
              to=""
              onClick={() =>
                dispatch(setCurrentPage({ nextPage: Page.AIRDROP }))
              }
            >
              <Text
                sx={{
                  color: currentPage === Page.AIRDROP ? "accent" : "text",
                  ml: 1,
                  mr: 4,
                }}
                variant="subtitle"
              >
                Airdrop
              </Text>
            </StyledLink>
            <AccountProfile />
          </Flex>
        </Flex>
      </Container>

      <ConnectWallet
        isOpen={showConnectWalletModal}
        goBack={() => setShowConnectWalletModal(false)}
      />
    </>
  );
};
