import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Container, Flex, Text } from "theme-ui";
import { Logo } from "components/Logo";
import { AccountProfile } from "components/AccountProfile";
import styled from "@emotion/styled";
import { Page } from "state/global";

const StyledLink = styled(Link)({
  height: "fit-content",
  textDecoration: "none",
});

export const DesktopHeader: React.FC = () => {
  const location = useLocation();

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
            <StyledLink to="exchange">
              <Text
                sx={{
                  color: location.pathname.includes(Page.EXCHANGE)
                    ? "accent"
                    : "text",
                  mx: 1,
                }}
                variant="subtitle"
              >
                Exchange
              </Text>
            </StyledLink>
            <Text>/</Text>
            <StyledLink to="deposit">
              <Text
                sx={{
                  color: location.pathname.includes(Page.DEPOSIT)
                    ? "accent"
                    : "text",
                  mx: 1,
                }}
                variant="subtitle"
              >
                Deposit
              </Text>
            </StyledLink>
            <Text>/</Text>
            <StyledLink to="withdraw">
              <Text
                sx={{
                  color: location.pathname.includes(Page.WITHDRAW)
                    ? "accent"
                    : "text",
                  mx: 1,
                }}
                variant="subtitle"
              >
                Withdraw
              </Text>
            </StyledLink>
            <Text>/</Text>
            <StyledLink to="mine">
              <Text
                sx={{
                  color: location.pathname.includes(Page.MINE)
                    ? "accent"
                    : "text",
                  mx: 1,
                }}
                variant="subtitle"
              >
                Mine
              </Text>
            </StyledLink>
            <Text>/</Text>
            <StyledLink to="redeem">
              <Text
                sx={{
                  color: location.pathname.includes(Page.REDEEM)
                    ? "accent"
                    : "text",
                  mx: 1,
                }}
                variant="subtitle"
              >
                Redeem
              </Text>
            </StyledLink>
            <Text>/</Text>
            <StyledLink to="report">
              <Text
                sx={{
                  color: location.pathname.includes(Page.COMPLIANCE)
                    ? "accent"
                    : "text",
                  mx: 1,
                }}
                variant="subtitle"
              >
                Report
              </Text>
            </StyledLink>
            <Text>/</Text>
            <StyledLink to="airdrop">
              <Text
                sx={{
                  color: location.pathname.includes(Page.AIRDROP)
                    ? "accent"
                    : "text",
                  mx: 1,
                }}
                variant="subtitle"
              >
                Airdrop
              </Text>
            </StyledLink>
            <Text>/</Text>
            <StyledLink to="stake">
              <Text
                sx={{
                  color: location.pathname.includes(Page.STAKE)
                    ? "accent"
                    : "text",
                  mx: 1,
                }}
                variant="subtitle"
              >
                Stake
              </Text>
            </StyledLink>
            <Box ml={4}>
              <AccountProfile />
            </Box>
          </Flex>
        </Flex>
      </Container>
    </>
  );
};
