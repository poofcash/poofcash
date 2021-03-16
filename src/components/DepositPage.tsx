import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { DEPOSIT_AMOUNTS, NETWORK, TORNADO_INSTANCES_ADDRESSES, AMOUNTS_DISABLED } from 'config';
import { getNoteStringAndCommitment } from 'utils/snarks-functions';
import { getAnonymitySetSize } from 'utils/axios-functions';
import Spinner from './Spinner';
import Modal from './Modal';
import { ledger } from 'connectors';
import { useActiveWeb3React } from 'hooks/web3';
import { useApproveCallback, ApprovalState, useDepositCallback, DepositState } from 'hooks/writeContract';
import { TokenAmount, CELO, ChainId } from '@ubeswap/sdk';

declare global {
    interface Window {
        // TODO no-any
        genZKSnarkProofAndWitness: any;
    }
}

// pass props and State interface to Component class
const DepositPage = () => {
    const { library, account } = useActiveWeb3React();
    const { activate } = useWeb3React();
    const [state, setState] = React.useState({
        celoAmount: 0.1, // default option
        anonymitySetSize: 0,
        noteString: '',
        anonymitySetLoading: false,
        showDepositInfo: false,
        showModal: false,
    });
    const tornadoAddress = TORNADO_INSTANCES_ADDRESSES[NETWORK][state.celoAmount];
    const [approvalState, approveCallback] = useApproveCallback(
        new TokenAmount(CELO[ChainId.ALFAJORES], (state.celoAmount * 10 ** 18).toString()),
        tornadoAddress,
    );
    console.log('Approval', approvalState);
    const [depositState, depositCallback] = useDepositCallback(state.celoAmount);
    console.log('Deposit', depositState);

    const setAnonymitySetSize = async (amount: number) => {
        setState({ ...state, anonymitySetLoading: true });
        let size = await getAnonymitySetSize(amount);
        setState({ ...state, anonymitySetSize: size, anonymitySetLoading: false });
    };

    // TODO balance of contract and divide
    //React.useEffect(() => {
    //setAnonymitySetSize(state.celoAmount);
    //}, [setAnonymitySetSize, state.celoAmount]);

    const loading = approvalState === ApprovalState.PENDING || depositState === DepositState.PENDING;

    const connectWallet = async () => {
        const connector = ledger;
        await activate(connector, undefined, true).catch(console.error);
    };

    // set the amount of BTC which the user wants to deposit
    const setBtcAmountHandler = (amount: number) => {
        setState({ ...state, celoAmount: amount, showDepositInfo: false });

        // show anonymity set size for selected amount
        setAnonymitySetSize(amount);
    };

    const closeModal = async () => {
        setState({ ...state, showModal: false });
    };

    const approveHandler = async () => {
        if (!library || !account) {
            return;
        }
        approveCallback();
    };

    const depositHandler = async () => {
        if (!library || !account) {
            return;
        }

        try {
            const celoAmount = state.celoAmount;
            // TODO verify sufficient balance
            //const tokenInstance = new Contract(
            //TOKEN_ADDRESS.alfajores,
            //tokenABI,
            //getProviderOrSigner(library, account),
            //);

            // check if the user has sufficient token balance
            // TODO
            // const usersTokenBalance = await tokenInstance.methods.balanceOf(userAddress).call();
            // if (usersTokenBalance < celoAmount * 10 ** 18) {
            //   setState({...state, showModal: true, loading: false});
            //   throw 'Insufficient balance of CELO tokens';
            // }

            // ----- DEPOSIT TX -----
            // et noteString and commitment
            console.log('getting noteString');

            const { noteString, commitment } = getNoteStringAndCommitment(
                'celo',
                celoAmount,
                44787, // TODO hardcode
            );
            console.log('Commitment', commitment);

            // send deposit Tx
            depositCallback(commitment);
            setState({ ...state, showDepositInfo: true, noteString });
        } catch (error) {
            console.log('Error occured while making deposit');
            console.error(error);
            setState({ ...state });
        }
    };

    const amountOptions = (
        <ul className="deposit-amounts-ul">
            {DEPOSIT_AMOUNTS.map((amount, index) => (
                <li key={index}>
                    <label className="container">
                        {amount} CELO
                        <input
                            checked={state.celoAmount === amount}
                            type="radio"
                            name="amounts"
                            id={index.toString()}
                            value={amount}
                            onChange={() => setBtcAmountHandler(amount)}
                            disabled={loading || AMOUNTS_DISABLED.includes(amount)} // don't allow the user to change CELO amount while transactions are being provessed
                        />
                        <span className="checkmark" />
                    </label>
                </li>
            ))}
        </ul>
    );

    // show deposit information is available
    let depositInfo = <></>;
    if (state.noteString !== '' && !loading && state.showDepositInfo) {
        depositInfo = (
            <div className="deposit-info-div">
                <h3>Success!</h3>
                <p>Keep this note. It allows you to withdraw anonymized CELO.</p>
                <div className="notestring">{state.noteString}</div>
            </div>
        );
    }

    let approveButton = (
        <button className="make-deposit-button hover-button" onClick={approveHandler}>
            Approve
        </button>
    );

    let connectWalletButton = (
        <button className="make-deposit-button hover-button" onClick={connectWallet}>
            Connect with Ledger
        </button>
    );

    let depositButton = <></>;
    if (library) {
        if (state.showDepositInfo) {
            depositButton = <></>;
        } else {
            depositButton = (
                <button className="make-deposit-button hover-button" onClick={depositHandler}>
                    Deposit
                </button>
            );
        }
    }

    let loadingApprove = <></>;
    if (approvalState === ApprovalState.PENDING) {
        loadingApprove = (
            <div>
                <p className="sending-tx-label">Sending approve transaction...</p>
            </div>
        );
    }

    let loadingDeposit = <></>;
    if (depositState === DepositState.PENDING) {
        loadingDeposit = (
            <div>
                <p className="sending-tx-label">Sending deposit transaction...</p>
            </div>
        );
    }

    let insufficientBalanceModal = <></>;
    if (state.showModal) {
        insufficientBalanceModal = (
            <Modal modalClosed={closeModal} show={state.showModal}>
                <h2>Insufficient balance</h2>
                <p>
                    You don't have enough CELO tokens. You need {state.celoAmount} CELO. You can get more CELO{' '}
                    <a target="_blank" rel="noopener noreferrer" href="https://celo.org/developers/faucet">
                        here
                    </a>
                    .
                </p>
            </Modal>
        );
    }

    let button = connectWalletButton;
    if (account) {
        if (approvalState === ApprovalState.NOT_APPROVED) {
            button = approveButton;
        } else {
            button = depositButton;
        }
    }

    return (
        <div>
            <h3 className="deposit-headline">Specify a CELO amount to deposit</h3>

            {amountOptions}
            {/*
      TODO
            <h3 className="anonymity-size">
                Anonymity set size: {state.anonymitySetSize === -1 ? <>Loading...</> : <b>{state.anonymitySetSize}</b>}
              </h3>
        */}

            {depositInfo}

            {insufficientBalanceModal}

            {loading ? (
                <>
                    <Spinner />
                    {loadingApprove}
                    {loadingDeposit}
                </>
            ) : (
                <>{button}</>
            )}
            {account && <p>Account: {account}</p>}
        </div>
    );
};

export default DepositPage;
