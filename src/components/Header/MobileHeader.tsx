import React from "react";
import { Button, Container, Flex } from "theme-ui";
import { Logo } from "components/Logo";
import { AccountProfile } from "components/AccountProfile";
import { Page } from "state/global";
import { useHistory, useLocation } from "react-router-dom";

export const MobileHeader: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

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
              location.pathname.includes(Page.EXCHANGE)
                ? "switcherSelected"
                : "switcher"
            }
            onClick={() => history.push(Page.EXCHANGE)}
          >
            Exchange
          </Button>
          <Button
            variant={
              location.pathname.includes(Page.DEPOSIT)
                ? "switcherSelected"
                : "switcher"
            }
            onClick={() => history.push(Page.DEPOSIT)}
          >
            Deposit
          </Button>
          <Button
            variant={
              location.pathname.includes(Page.WITHDRAW)
                ? "switcherSelected"
                : "switcher"
            }
            onClick={() => history.push(Page.WITHDRAW)}
          >
            Withdraw
          </Button>
          <Button
            variant={
              location.pathname.includes(Page.MINE)
                ? "switcherSelected"
                : "switcher"
            }
            onClick={() => history.push(Page.MINE)}
          >
            Mine
          </Button>
          <Button
            variant={
              location.pathname.includes(Page.REDEEM)
                ? "switcherSelected"
                : "switcher"
            }
            onClick={() => history.push(Page.REDEEM)}
          >
            Redeem
          </Button>
          <Button
            variant={
              location.pathname.includes(Page.AIRDROP)
                ? "switcherSelected"
                : "switcher"
            }
            onClick={() => history.push(Page.AIRDROP)}
          >
            Airdrop
          </Button>
          <Button
            variant={
              location.pathname.includes(Page.STAKE)
                ? "switcherSelected"
                : "switcher"
            }
            onClick={() => history.push(Page.STAKE)}
          >
            Stake
          </Button>
        </Flex>
      </Container>
    </Container>
  );
};
