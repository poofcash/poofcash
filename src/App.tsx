import React from "react";
import CompliancePage from "pages/CompliancePage";
import WithdrawPage from "pages/WithdrawPage";
import DepositPage from "pages/DepositPage";
import { CHAIN_ID, IP_URL } from "config";
import { Heading } from "@theme-ui/components";
import { Alert, Button, Container, Flex, Text } from "theme-ui";
import axios from "axios";
import { ledger, network, valora } from "connectors";
import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "index";
import { requestValoraAuth } from "connectors/valora/valoraUtils";
import { BlockscoutAddressLink } from "components/Links";
import styled from "@emotion/styled";

type UserLocation = {
  country: string;
  region: string;
  eu: string;
  timezone: string;
  city: string;
  ll: Array<number>;
  metro: number;
  area: number;
  ip: string;
};

const AccountCircle = styled.div({
  height: "32px",
  width: "32px",
  backgroundColor: "#499EE9",
  borderRadius: "50%",
  display: "inline-block",
  marginRight: "8px",
});

// pass props and State interface to Component class
const App = () => {
  const { activate: activateNetwork, library } = useWeb3React(
    NetworkContextName
  );
  const { activate, account } = useWeb3React();

  React.useEffect(() => {
    if (!library) {
      activateNetwork(network);
    }
  }, [library, activateNetwork]);

  const withdrawPage = React.useMemo(() => <WithdrawPage />, []);
  const depositPage = React.useMemo(() => <DepositPage />, []);
  const compliancePage = React.useMemo(() => <CompliancePage />, []);
  const [selectedPage, setSelectedPage] = React.useState(depositPage);
  const [userLocation, setUserLocation] = React.useState<UserLocation>();
  React.useEffect(() => {
    axios
      .get(IP_URL)
      .then(({ data }) => setUserLocation(data))
      .catch(console.error);
  }, []);

  const switchToDeposit = () => {
    setSelectedPage(depositPage);
  };
  const switchToWithdraw = () => {
    setSelectedPage(withdrawPage);
  };
  const switchToCompliance = () => {
    setSelectedPage(compliancePage);
  };

  const connectLedgerWallet = async () => {
    await activate(ledger, undefined, true).catch(alert);
  };

  const connectValoraWallet = async () => {
    const resp = await requestValoraAuth();
    valora.setSavedValoraAccount(resp);
    activate(valora, undefined, true).catch(console.error);
  };

  return (
    <>
      {CHAIN_ID === 44787 && (
        <Alert>NOTE: This is poof.cash on the Alfajores testnet.</Alert>
      )}
      <Container sx={{ width: "auto" }}>
        <Container sx={{ pt: 4, px: 4, backgroundColor: "#F1F4F4" }}>
          <Flex sx={{ mb: 4, justifyContent: "space-between" }}>
            <Heading>Poof</Heading>
            {!account && (
              <Flex sx={{ justifyContent: "flex-end" }}>
                <Button
                  sx={{ mr: 1 }}
                  variant="outline"
                  onClick={connectLedgerWallet}
                >
                  Ledger
                </Button>
                <Button variant="outline" onClick={connectValoraWallet}>
                  Valora
                </Button>
              </Flex>
            )}
            {account && (
              <Flex sx={{ justifyContent: "flex-end" }}>
                <AccountCircle />
                <Flex sx={{ flexDirection: "column", maxWidth: "50vw" }}>
                  <BlockscoutAddressLink address={account}>
                    <Text
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      variant="regular"
                    >
                      {account}
                    </Text>
                  </BlockscoutAddressLink>
                  {userLocation && (
                    <Text variant="form">
                      IP: {userLocation.ip}, {userLocation.city},{" "}
                      {userLocation.country}
                    </Text>
                  )}
                </Flex>
              </Flex>
            )}
          </Flex>
          <Flex sx={{ width: "fit-content" }}>
            <Button
              variant={
                selectedPage.type === depositPage.type
                  ? "switcherSelected"
                  : "switcher"
              }
              onClick={switchToDeposit}
            >
              Deposit
            </Button>
            <Button
              variant={
                selectedPage.type === withdrawPage.type
                  ? "switcherSelected"
                  : "switcher"
              }
              onClick={switchToWithdraw}
            >
              Withdraw
            </Button>
            <Button
              variant={
                selectedPage.type === compliancePage.type
                  ? "switcherSelected"
                  : "switcher"
              }
              onClick={switchToCompliance}
            >
              Compliance
            </Button>
          </Flex>
        </Container>
        <Container sx={{ px: 4, py: 4 }}>{selectedPage}</Container>
      </Container>
      {/*TODO footer*/}
    </>
  );
};

export default App;
