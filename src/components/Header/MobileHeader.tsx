import React from "react";
import { Button, Container, Flex } from "theme-ui";
import { Logo } from "components/Logo";
import { AccountProfile } from "components/AccountProfile";
import { Page } from "state/global";
import { useHistory, useLocation } from "react-router-dom";

const HeaderButton: React.FC<{ page: Page }> = ({ page, children }) => {
  const location = useLocation();
  const history = useHistory();
  return (
    <Button
      variant={
        location.pathname.includes(page) ? "switcherSelected" : "switcher"
      }
      onClick={() => history.push(page)}
    >
      {children}
    </Button>
  );
};

export const MobileHeader: React.FC = () => {
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
          <HeaderButton page={Page.EXCHANGE}>Exchange</HeaderButton>
          <HeaderButton page={Page.DEPOSIT}>Deposit</HeaderButton>
          <HeaderButton page={Page.WITHDRAW}>Withdraw</HeaderButton>
          <HeaderButton page={Page.MINE}>Mine</HeaderButton>
          <HeaderButton page={Page.REDEEM}>Redeem</HeaderButton>
          <HeaderButton page={Page.COMPLIANCE}>Report</HeaderButton>
          <HeaderButton page={Page.AIRDROP}>Airdrop</HeaderButton>
          <HeaderButton page={Page.STAKE}>Stake</HeaderButton>
        </Flex>
      </Container>
    </Container>
  );
};
