import React from 'react';
import WithdrawPage from 'components/WithdrawPage';
import DepositPage from 'components/DepositPage';
import Footer from 'components/Footer';
import { network } from 'connectors';
import { useWeb3React } from '@web3-react/core';

import 'styles/App.css';
import 'styles/index.css';
import 'styles/Backdrop.css';
import 'styles/Modal.css';
import 'styles/Spinner.css';

// pass props and State interface to Component class
const App = () => {
    const [state, setState] = React.useState({
        pageSelected: 'deposit',
        web3: null,
    });
    const { activate } = useWeb3React();
    React.useEffect(() => {
        activate(network);
    }, [activate]);

    const switchToDeposit = () => {
        setState({ ...state, pageSelected: 'deposit' });
    };

    const switchToWithdraw = () => {
        setState({ ...state, pageSelected: 'withdraw' });
    };

    let withdrawButtonClasses = 'unselected';
    let depositButtonClasses = 'unselected';

    let pageContent;

    if (state.pageSelected === 'withdraw') {
        withdrawButtonClasses = 'selected';
        pageContent = <WithdrawPage />;
    } else {
        depositButtonClasses = 'selected';
        pageContent = <DepositPage />;
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
                        <button className={withdrawButtonClasses} onClick={switchToWithdraw}>
                            Withdraw
                        </button>
                    </div>
                    <div className="content-wrapper">{pageContent}</div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default App;
