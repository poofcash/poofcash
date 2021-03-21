import React from "react";
import WithdrawPage from "pages/WithdrawPage";
import DepositPage from "pages/DepositPage";
import { CHAIN_ID } from "config";
import { Heading } from "@theme-ui/components";
import { Alert, Button, Container } from "theme-ui";
import styled from "@emotion/styled";

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
  const withdrawPage = React.useMemo(() => <WithdrawPage />, []);
  const depositPage = React.useMemo(() => <DepositPage />, []);
  const [selectedPage, setSelectedPage] = React.useState(depositPage);

  const switchToDeposit = () => {
    setSelectedPage(depositPage);
  };

  const switchToWithdraw = () => {
    setSelectedPage(withdrawPage);
  };

  return (
    <>
      {CHAIN_ID === 44787 && (
        <Alert>NOTE: This is poof.cash on the Alfajores testnet.</Alert>
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
