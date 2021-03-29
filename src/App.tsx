import React from "react";
import CompliancePage from "pages/CompliancePage";
import WithdrawPage from "pages/WithdrawPage";
import DepositPage from "pages/DepositPage";
import { CHAIN_ID, IP_URL } from "config";
import { Heading } from "@theme-ui/components";
import { Alert, Button, Container } from "theme-ui";
import styled from "@emotion/styled";
import axios from "axios";
import { network } from "connectors";
import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "index";

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

const Page = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
});

const PageSwitcher = styled.div({
  marginTop: "16px",
});

// pass props and State interface to Component class
const App = () => {
  const { activate, library } = useWeb3React(NetworkContextName);

  React.useEffect(() => {
    if (!library) {
      activate(network);
    }
  }, [library, activate]);

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

  return (
    <>
      {CHAIN_ID === 44787 && (
        <Alert>NOTE: This is poof.cash on the Alfajores testnet.</Alert>
      )}
      {userLocation && (
        <Alert>
          Your IP: {userLocation.ip}, {userLocation.city},{" "}
          {userLocation.country}
        </Alert>
      )}
      <Page>
        <Heading>Poof</Heading>
        <PageSwitcher>
          <Button
            variant={
              selectedPage.type === depositPage.type ? "secondary" : "outline"
            }
            onClick={switchToDeposit}
          >
            Deposit
          </Button>
          <Button
            variant={
              selectedPage.type === withdrawPage.type ? "secondary" : "outline"
            }
            onClick={switchToWithdraw}
          >
            Withdraw
          </Button>
          <Button
            variant={
              selectedPage.type === compliancePage.type
                ? "secondary"
                : "outline"
            }
            onClick={switchToCompliance}
          >
            Compliance
          </Button>
        </PageSwitcher>
        <Container mt={16} sx={{ width: "66%" }}>
          {selectedPage}
        </Container>
      </Page>
      {/*TODO footer*/}
    </>
  );
};

export default App;
