import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Container, Flex } from "theme-ui";
import { Logo } from "components/Logo";
import { AccountProfile } from "components/AccountProfile";

export const MobileHeader: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
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
            location.pathname.includes("deposit")
              ? "switcherSelected"
              : "switcher"
          }
          onClick={() => history.push("/deposit")}
        >
          Deposit
        </Button>
        <Button
          variant={
            location.pathname.includes("withdraw")
              ? "switcherSelected"
              : "switcher"
          }
          onClick={() => history.push("/withdraw")}
        >
          Withdraw
        </Button>
      </Flex>
    </Container>
  );
};
