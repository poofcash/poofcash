import React from "react";
import { Link } from "react-router-dom";
import { Box, Container, Flex, Text } from "theme-ui";
import { Logo } from "components/Logo";
import { AccountProfile } from "components/AccountProfile";
import styled from "@emotion/styled";
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
                dispatch(setCurrentPage({ nextPage: Page.EXCHANGE }))
              }
            >
              <Text
                sx={{
                  color: currentPage === Page.EXCHANGE ? "accent" : "text",
                  mx: 1,
                }}
                variant="subtitle"
              >
                Exchange
              </Text>
            </StyledLink>
            <Text>/</Text>
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
                  mx: 1,
                }}
                variant="subtitle"
              >
                Airdrop
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
