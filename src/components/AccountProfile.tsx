import React from "react";
import styled from "@emotion/styled";
import { Box, Card, Flex, useColorMode } from "theme-ui";
import { Text } from "theme-ui";
import { useContractKit } from "@celo-tools/use-contractkit";
import { shortenAccount } from "hooks/accountName";
import { Page } from "state/global";
import { UserCircle, Wallet } from "phosphor-react";
import { StyledLink } from "components/StyledLink";
import { WalletDetails } from "components/Wallet/WalletDetails";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { CloseOnClickaway } from "components/CloseOnClickaway";
import { PoofAccountDetails } from "components/PoofAccount/PoofAccountDetails";

const HoverDetails = styled(Box)<{ colorMode: string }>(({ colorMode }) => {
  return {
    position: "absolute",
    backgroundColor:
      colorMode === "dark"
        ? "var(--theme-ui-colors-secondaryBackground)"
        : "var(--theme-ui-colors-background)",
    padding: "12px",
    top: 60,
    right: 0,
    borderRadius: "6px",
    color: "var(--theme-ui-colors-primaryText)",
    border: "1px solid",
  };
});

export const AccountProfile: React.FC = () => {
  const { address, connect } = useContractKit();
  const { poofAccount } = PoofAccountGlobal.useContainer();
  const [colorMode] = useColorMode();

  const [accountDetailsOpen, setAccountDetailsOpen] = React.useState(false);
  const [walletDetailsOpen, setWalletDetailsOpen] = React.useState(false);

  const accountCard = React.useRef<HTMLDivElement>(null);
  const walletCard = React.useRef<HTMLDivElement>(null);

  return (
    <Flex sx={{ alignItems: "center" }}>
      <Box sx={{ position: "relative" }}>
        {poofAccount ? (
          <Card
            ref={accountCard}
            sx={{ cursor: "pointer" }}
            variant="warning"
            ml={5}
            onClick={() => {
              setAccountDetailsOpen(!accountDetailsOpen);
            }}
          >
            <Flex sx={{ alignItems: "center", color: "primaryText" }}>
              <UserCircle size={32} />
              <Text variant="primary" ml={2} mt={1}>
                {shortenAccount("0x" + poofAccount.address)}
              </Text>
            </Flex>
          </Card>
        ) : (
          <StyledLink to={Page.SETUP} color="primaryText">
            Log in
          </StyledLink>
        )}
        {poofAccount && accountDetailsOpen && (
          <CloseOnClickaway
            onClickaway={(e) => {
              if (accountCard?.current?.contains(e.target)) {
                return;
              }
              setAccountDetailsOpen(false);
            }}
          >
            <HoverDetails colorMode={colorMode}>
              <PoofAccountDetails />
            </HoverDetails>
          </CloseOnClickaway>
        )}
      </Box>

      <Box sx={{ position: "relative" }}>
        <Card
          ref={walletCard}
          sx={{ cursor: "pointer" }}
          variant="warning"
          ml={5}
          onClick={() => {
            if (address) {
              setWalletDetailsOpen(!walletDetailsOpen);
            } else {
              connect();
            }
          }}
        >
          <Flex sx={{ alignItems: "center", color: "primaryText" }}>
            <Wallet size={32} />
            <Text variant="primary" ml={2} mt={1}>
              {address ? shortenAccount(address) : "Connect Wallet"}
            </Text>
          </Flex>
        </Card>
        {address && walletDetailsOpen && (
          <CloseOnClickaway
            onClickaway={(e) => {
              if (walletCard?.current?.contains(e.target)) {
                return;
              }
              setWalletDetailsOpen(false);
            }}
          >
            <HoverDetails colorMode={colorMode}>
              <WalletDetails />
            </HoverDetails>
          </CloseOnClickaway>
        )}
      </Box>
    </Flex>
  );
};
