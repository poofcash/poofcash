import React from "react";
import { Box, Button, Container, Flex } from "theme-ui";
import { Page } from "state/global";
import { useHistory, useLocation } from "react-router-dom";
import { UserCircle } from "phosphor-react";
import { WalletCard } from "components/Wallet/WalletCard";
import { useRecoilState } from "recoil";
import { poofAccountDrawerOpen } from "components/PoofAccount/PoofAccountDrawer";
import { walletDrawerOpen } from "components/Wallet/WalletDrawer";

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
  const [accountDrawerIsOpen, setAccountDrawerIsOpen] = useRecoilState(
    poofAccountDrawerOpen
  );
  const [, setWalletDrawerIsOpen] = useRecoilState(walletDrawerOpen);
  return (
    <Container sx={{ pt: 4, px: 3, width: "auto" }}>
      <Flex
        sx={{
          mb: 2,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          color="primaryText"
          onClick={() => {
            if (!accountDrawerIsOpen) {
              setWalletDrawerIsOpen(false);
            }
            setAccountDrawerIsOpen(!accountDrawerIsOpen);
          }}
        >
          <UserCircle size={36} />
        </Box>
        <WalletCard />
      </Flex>
      <Container sx={{ overflow: "scroll" }} mt={3}>
        <Flex sx={{ width: "fit-content", borderBottom: "1px solid #E0E0E0" }}>
          <HeaderButton page={Page.DEPOSIT}>Deposit</HeaderButton>
          <HeaderButton page={Page.WITHDRAW}>Withdraw</HeaderButton>
          <HeaderButton page={Page.MINE}>Mine</HeaderButton>
          <HeaderButton page={Page.REDEEM}>Redeem</HeaderButton>
          <HeaderButton page={Page.COMPLIANCE}>Report</HeaderButton>
          <HeaderButton page={Page.AIRDROP}>Airdrop</HeaderButton>
          <HeaderButton page={Page.REFUND}>Refund</HeaderButton>
        </Flex>
      </Container>
    </Container>
  );
};
