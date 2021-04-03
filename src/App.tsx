import React from "react";
import CompliancePage from "pages/CompliancePage";
import WithdrawPage from "pages/WithdrawPage";
import DepositPage from "pages/DepositPage";
import { IP_URL } from "config";
import { Button, Container, Flex, Text } from "theme-ui";
import axios from "axios";
import { network, valora } from "connectors";
import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "index";
import { BlockscoutAddressLink } from "components/Links";
import { useInitValoraResponse } from "connectors/valora/valoraUtils";
import {
  Switch,
  Route,
  useHistory,
  useLocation,
  Redirect,
} from "react-router-dom";
import { ProfileIcon } from "icons/ProfileIcon";
import { Logo } from "components/Logo";

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
            <Logo />
            <Flex sx={{ alignItems: "center", justifyContent: "flex-end" }}>
              <Flex
                sx={{
                  flexDirection: "column",
                  maxWidth: "50vw",
                  mr: 2,
                  textAlign: "right",
                }}
              >
                {account ? (
                  <BlockscoutAddressLink address={account}>
                    <Text variant="wallet">{accountName}</Text>
                  </BlockscoutAddressLink>
                ) : (
                  <Text variant="wallet">????...????</Text>
                )}
                {userLocation && (
                  <Text variant="form">
                    IP: {userLocation.ip}, {userLocation.city},{" "}
                    {userLocation.country}
                  </Text>
                )}
              </Flex>
              <ProfileIcon />
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
        <Container
          sx={{ px: 3, py: 4, mb: "48px", maxHeight: "calc(100vh + 48px)" }}
        >
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
