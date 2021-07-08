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
    <Container sx={{ pt: 4, px: 3, width: "auto", backgroundColor: "box" }}>
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
      <Container sx={{ overflow: "scroll" }}>
        <Flex sx={{ width: "fit-content" }}>
          <Button
            variant={
              currentPage === Page.EXCHANGE ? "switcherSelected" : "switcher"
            }
            onClick={() =>
              dispatch(setCurrentPage({ nextPage: Page.EXCHANGE }))
            }
          >
            Exchange
          </Button>
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
            onClick={() =>
              dispatch(setCurrentPage({ nextPage: Page.WITHDRAW }))
            }
          >
            Withdraw
          </Button>
          <Button
            variant={
              currentPage === Page.MINE ? "switcherSelected" : "switcher"
            }
            onClick={() => dispatch(setCurrentPage({ nextPage: Page.MINE }))}
          >
            Mine
          </Button>
          <Button
            variant={
              currentPage === Page.REDEEM ? "switcherSelected" : "switcher"
            }
            onClick={() => dispatch(setCurrentPage({ nextPage: Page.REDEEM }))}
          >
            Redeem
          </Button>
          <Button
            variant={
              currentPage === Page.AIRDROP ? "switcherSelected" : "switcher"
            }
            onClick={() => dispatch(setCurrentPage({ nextPage: Page.AIRDROP }))}
          >
            Airdrop
          </Button>
        </Flex>
      </Container>
    </Container>
  );
};
