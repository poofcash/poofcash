import React from "react";
import WithdrawPage from "pages/WithdrawPage";
import DepositPage from "pages/DepositPage";
import Footer from "components/Footer";
import { Button } from "components/Button";

import "styles/App.css";
import "styles/index.css";

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

  let withdrawButtonClasses = "unselected";
  let depositButtonClasses = "unselected";
  if (selectedPage === withdrawPage) {
    withdrawButtonClasses = "selected";
  } else {
    depositButtonClasses = "selected";
  }

  return (
    <>
      <div className="App">
        <h1>Poof</h1>
        <div className="page-wrapper">
          <div className="page-selector-div">
            <Button className={depositButtonClasses} onClick={switchToDeposit}>
              Deposit
            </Button>
            <Button
              className={withdrawButtonClasses}
              onClick={switchToWithdraw}
            >
              Withdraw
            </Button>
          </div>
          <div className="content-wrapper">{selectedPage}</div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default App;
