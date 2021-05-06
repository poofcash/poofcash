import React from "react";
import { Button, Container, Flex } from "theme-ui";
import { Logo } from "components/Logo";
import { AccountProfile } from "components/AccountProfile";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "state";
import { Page, setCurrentPage } from "state/global";

export const MobileHeader: React.FC = () => {
  const currentPage = useSelector(
    (state: AppState) => state.global.currentPage
  );
  const dispatch = useDispatch();

  return (
    <Container sx={{ pt: 4, px: 3, width: "auto", backgroundColor: "#F1F4F4" }}>
      <Flex
        sx={{
          mb: 2,
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Logo />
        <AccountProfile />
      </Flex>
      <Flex sx={{ width: "fit-content" }}>
        <Button
          variant={
            currentPage === Page.DEPOSIT ? "switcherSelected" : "switcher"
          }
          onClick={() => dispatch(setCurrentPage({ nextPage: Page.DEPOSIT }))}
        >
          Deposit
        </Button>
        <Button
          variant={
            currentPage === Page.WITHDRAW ? "switcherSelected" : "switcher"
          }
          onClick={() => dispatch(setCurrentPage({ nextPage: Page.WITHDRAW }))}
        >
          Withdraw
        </Button>
      </Flex>
    </Container>
  );
};
