import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Container, Flex, Text } from "theme-ui";
import { Logo } from "components/Logo";
import { AccountProfile } from "components/AccountProfile";
import { Page } from "state/global";
import { StyledLink } from "components/StyledLink";

const HeaderLink: React.FC<{ page: Page }> = ({ page, children }) => {
  const location = useLocation();
  const selected = location.pathname.includes(page);
  return (
    <Box mr={2}>
      <StyledLink to={page}>
        <Text
          sx={{
            color: selected ? "primary" : "text",
            borderBottom: selected ? "2px solid" : "none",
            mx: 1,
            pb: 1,
          }}
          variant="subtitle"
        >
          {children}
        </Text>
      </StyledLink>
    </Box>
  );
};

export const DesktopHeader: React.FC = () => {
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
          <Flex
            sx={{
              alignItems: "center",
            }}
          >
            <Box mr={4}>
              <Logo />
            </Box>
            <HeaderLink page={Page.DEPOSIT}>Deposit</HeaderLink>
            <HeaderLink page={Page.WITHDRAW}>Withdraw</HeaderLink>
            <HeaderLink page={Page.MINE}>Mine</HeaderLink>
            <HeaderLink page={Page.REDEEM}>Redeem</HeaderLink>
            <HeaderLink page={Page.EXCHANGE}>Swap</HeaderLink>
            <HeaderLink page={Page.COMPLIANCE}>Report</HeaderLink>
            <HeaderLink page={Page.AIRDROP}>Airdrop</HeaderLink>
            <HeaderLink page={Page.STAKE}>Stake</HeaderLink>
          </Flex>
          <Box ml={4}>
            <AccountProfile />
          </Box>
        </Flex>
      </Container>
    </>
  );
};
