import React from "react";
import CompliancePage from "pages/CompliancePage";
import WithdrawPage from "pages/WithdrawPage";
import DepositPage from "pages/DepositPage";
import { CHAIN_ID, IP_URL } from "config";
import { Heading } from "@theme-ui/components";
import { Button, Container, Flex, Text } from "theme-ui";
import axios from "axios";
import { network, valora } from "connectors";
import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "index";
import { BlockscoutAddressLink } from "components/Links";
import styled from "@emotion/styled";
import { useInitValoraResponse } from "connectors/valora/valoraUtils";
import {
  Switch,
  Route,
  useHistory,
  useLocation,
  Redirect,
  Link,
} from "react-router-dom";

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
  marginLeft: "8px",
});

// pass props and State interface to Component class
const App = () => {
  useInitValoraResponse();
  const { activate: activateNetwork, library } = useWeb3React(
    NetworkContextName
  );
  const { account } = useWeb3React();
  const history = useHistory();
  const location = useLocation();

  React.useEffect(() => {
    if (!library) {
      activateNetwork(network);
    }
  }, [library, activateNetwork]);

  const [userLocation, setUserLocation] = React.useState<UserLocation>();
  React.useEffect(() => {
    axios
      .get(IP_URL)
      .then(({ data }) => setUserLocation(data))
      .catch(console.error);
  }, []);

  let accountName = account;
  if (valora.valoraAccount?.phoneNumber) {
    accountName = valora.valoraAccount.phoneNumber;
  } else if (accountName) {
    accountName =
      accountName.slice(0, 6) +
      "..." +
      accountName.slice(accountName.length - 5, accountName.length - 1);
  }

  return (
    <>
      <Container sx={{ width: "auto" }}>
        <Container sx={{ pt: 4, px: 3, backgroundColor: "#F1F4F4" }}>
          <Flex
            sx={{
              mb: 2,
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Flex sx={{ alignItems: "baseline" }}>
              <Heading>
                <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                  Poof
                </Link>
              </Heading>
              {CHAIN_ID === 42220 && (
                <Text variant="subtitle">mainnet beta</Text>
              )}
              {CHAIN_ID === 44787 && <Text variant="subtitle">alfajores</Text>}
            </Flex>
            <Flex sx={{ justifyContent: "flex-end" }}>
              <Flex
                sx={{
                  textAlign: "right",
                  flexDirection: "column",
                  maxWidth: "50vw",
                }}
              >
                {account ? (
                  <BlockscoutAddressLink address={account}>
                    <Text variant="regular">{accountName}</Text>
                  </BlockscoutAddressLink>
                ) : (
                  <Text>--</Text>
                )}
                {userLocation && (
                  <Text variant="form">
                    IP: {userLocation.ip}, {userLocation.city},{" "}
                    {userLocation.country}
                  </Text>
                )}
              </Flex>
              <AccountCircle />
            </Flex>
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
        <Container sx={{ px: 3, py: 4 }}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/deposit" />
            </Route>
            <Route exact path="/deposit">
              <DepositPage />
            </Route>
            <Route exact path="/withdraw">
              <WithdrawPage />
            </Route>
            <Route exact path="/compliance">
              <CompliancePage />
            </Route>
          </Switch>
        </Container>
      </Container>
      {/*TODO footer*/}
    </>
  );
};

export default App;
