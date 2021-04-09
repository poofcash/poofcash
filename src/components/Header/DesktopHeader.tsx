import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Container, Flex, Text } from "theme-ui";
import { Logo } from "components/Logo";
import { AccountProfile } from "components/AccountProfile";
import styled from "@emotion/styled";
import { useWeb3React } from "@web3-react/core";
import { ConnectWallet } from "pages/ConnectWallet";

const StyledLink = styled(Link)({
  height: "fit-content",
  textDecoration: "none",
});

export const DesktopHeader: React.FC = () => {
  const location = useLocation();
  const { account } = useWeb3React();
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
            <StyledLink to={"/deposit"}>
              <Text
                sx={{
                  color: location.pathname.includes("deposit")
                    ? "accent"
                    : "text",
                  mr: 2,
                }}
                variant="subtitle"
              >
                Deposit
              </Text>
            </StyledLink>
            <StyledLink to={"/withdraw"}>
              <Text
                sx={{
                  color: location.pathname.includes("withdraw")
                    ? "accent"
                    : "text",
                  mr: 4,
                }}
                variant="subtitle"
              >
                Withdraw
              </Text>
            </StyledLink>
            {account ? (
              <AccountProfile />
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowConnectWalletModal(true)}
              >
                Connect Wallet
              </Button>
            )}
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
