import React from "react";
import WithdrawPage from "components/WithdrawPage";
import DepositPage from "components/DepositPage";
import Footer from "components/Footer";

import "styles/App.css";
import "styles/index.css";
import "styles/Backdrop.css";
import "styles/Modal.css";
import "styles/Spinner.css";

// pass props and State interface to Component class
const App = () => {
  const [state, setState] = React.useState({
    pageSelected: "deposit",
    web3: null,
  });

  const switchToDeposit = () => {
    setState({ ...state, pageSelected: "deposit" });
  };

  const switchToWithdraw = () => {
    setState({ ...state, pageSelected: "withdraw" });
  };

  let withdrawButtonClasses = "unselected";
  let depositButtonClasses = "unselected";

  const withdrawPage = React.useMemo(() => <WithdrawPage />, []);
  const depositPage = React.useMemo(() => <DepositPage />, []);

  let pageSelected;
  if (state.pageSelected === "withdraw") {
    withdrawButtonClasses = "selected";
    pageSelected = withdrawPage;
  } else {
    depositButtonClasses = "selected";
    pageSelected = depositPage;
  }

  return (
    <>
      <div className="App">
        <h1>Poof</h1>
        <div className="page-wrapper">
          <div className="page-selector-div">
            <button className={depositButtonClasses} onClick={switchToDeposit}>
              Deposit
            </button>
            <button
              className={withdrawButtonClasses}
              onClick={switchToWithdraw}
            >
              Withdraw
            </button>
          </div>
          <div className="content-wrapper">{pageSelected}</div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default App;
