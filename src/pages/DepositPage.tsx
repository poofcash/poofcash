import React from "react";
import { useWeb3React } from "@web3-react/core";
import { AMOUNTS_DISABLED, CHAIN_ID } from "config";
import { getNoteStringAndCommitment } from "utils/snarks-functions";
import Spinner from "components/Spinner";
import Modal from "components/Modal";
import { ledger, valora } from "connectors";
import { useActiveWeb3React } from "hooks/web3";
import {
  useApproveCallback,
  ApprovalState,
  useDepositCallback,
  DepositState,
} from "hooks/writeContract";
import { TokenAmount, CELO } from "@ubeswap/sdk";
import {
  requestValoraAuth,
  useInitValoraResponse,
} from "connectors/valora/valoraUtils";
import { instances } from "poof-token";
import { useGetTokenBalance } from "hooks/readContract";

declare global {
  interface Window {
    // TODO no-any
    genZKSnarkProofAndWitness: any;
  }
}

// pass props and State interface to Component class
const DepositPage = () => {
  useInitValoraResponse();

  const { account } = useActiveWeb3React();
  const { activate } = useWeb3React();
  const [selectedAmount, setSelectedAmount] = React.useState(0.1);
  const [noteString, setNoteString] = React.useState("");
  const [accountBalance, setAccountBalance] = React.useState<number>();
  const [state, setState] = React.useState({
    showDepositInfo: false,
    showModal: false,
  });
  const [currency] = React.useState("celo");
  const tornadoAddress =
    instances[`netId${CHAIN_ID}`][currency].instanceAddress[selectedAmount];
  const depositAmounts = Object.keys(
    instances[`netId${CHAIN_ID}`][currency].instanceAddress
  )
    .sort()
    .map(Number);
  const [approvalState, approveCallback] = useApproveCallback(
    new TokenAmount(CELO[CHAIN_ID], (selectedAmount * 10 ** 18).toString()),
    tornadoAddress
  );
  const [depositState, depositCallback] = useDepositCallback(selectedAmount);
  const getAccountBalance = useGetTokenBalance(CELO[CHAIN_ID], account);
  React.useEffect(() => {
    getAccountBalance()
      .then((tokenAmount) => setAccountBalance(Number(tokenAmount.toExact())))
      .catch(console.error);
  }, [getAccountBalance, account]);

  const loading =
    approvalState === ApprovalState.PENDING ||
    approvalState === ApprovalState.WAITING_CONFIRMATIONS ||
    depositState === DepositState.PENDING;

  const connectLedgerWallet = async () => {
    await activate(ledger, undefined, true).catch(console.error);
  };

  const connectValoraWallet = async () => {
    const resp = await requestValoraAuth();
    valora.setSavedValoraAccount(resp);
    activate(valora, undefined, true).catch(console.error);
  };

  const closeModal = async () => {
    setState({ ...state, showModal: false });
  };

  const approveHandler = async () => {
    if (!account) {
      return;
    }
    approveCallback();
  };

  const depositHandler = async () => {
    if (!account) {
      return;
    }

    try {
      if (!accountBalance) {
        console.error("Tried depositing without a defined account balance");
        return;
      }
      if (accountBalance < selectedAmount) {
        alert(
          `Insufficient balance (${accountBalance}) for depositing ${selectedAmount} CELO`
        );
        return;
      }

      const { noteString: note, commitment } = getNoteStringAndCommitment(
        currency,
        selectedAmount,
        CHAIN_ID
      );

      // send deposit Tx
      depositCallback(commitment);
      setNoteString(note);
      setState({ ...state, showDepositInfo: true });
    } catch (error) {
      console.log("Error occured while making deposit");
      console.error(error);
      setState({ ...state });
    }
  };

  const amountOptions = (
    <ul className="deposit-amounts-ul">
      {depositAmounts.map((depositAmount, index) => (
        <li key={index}>
          <label className="container">
            {depositAmount.toLocaleString()} CELO
            <input
              checked={depositAmount === selectedAmount}
              type="radio"
              name="amounts"
              id={index.toString()}
              value={depositAmount}
              onChange={() => setSelectedAmount(depositAmount)}
              disabled={loading || AMOUNTS_DISABLED.includes(depositAmount)} // don't allow the user to change CELO amount while transactions are being provessed
            />
            <span className="checkmark" />
          </label>
        </li>
      ))}
    </ul>
  );

  // show deposit information is available
  let depositInfo = <></>;
  if (noteString !== "" && !loading && state.showDepositInfo) {
    depositInfo = (
      <div className="deposit-info-div">
        <h3>Success!</h3>
        <p>Keep this note. It allows you to withdraw anonymized CELO.</p>
        <div className="notestring">{noteString}</div>
      </div>
    );
  }

  let approveButton = (
    <button
      className="make-deposit-button hover-button"
      onClick={approveHandler}
    >
      Approve
    </button>
  );

  let connectWalletButtons = (
    <>
      <button
        className="make-deposit-button hover-button"
        onClick={connectLedgerWallet}
      >
        Connect with Ledger
      </button>
      <button
        className="make-deposit-button hover-button"
        onClick={connectValoraWallet}
      >
        Connect with Valora
      </button>
    </>
  );

  let depositButton = <></>;
  if (account) {
    if (state.showDepositInfo) {
      depositButton = <></>;
    } else {
      depositButton = (
        <button
          className="make-deposit-button hover-button"
          onClick={depositHandler}
        >
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
  } else if (approvalState === ApprovalState.WAITING_CONFIRMATIONS) {
    loadingApprove = (
      <div>
        <p className="sending-tx-label">Waiting for confirmations...</p>
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
          You don't have enough CELO tokens. You need {selectedAmount} CELO. You
          can get more CELO{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://celo.org/developers/faucet"
          >
            here
          </a>
          .
        </p>
      </Modal>
    );
  }

  let button = connectWalletButtons;
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
      {accountBalance != null && <p>Balance: {accountBalance} CELO</p>}
    </div>
  );
};

export default DepositPage;
