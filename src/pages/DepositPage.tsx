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
import { BigNumber } from "@ethersproject/bignumber";
import { Label, Radio } from "@rebass/forms";
import { Flex, Text } from "rebass";

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
  const [contractBalance, setContractBalance] = React.useState<number>();
  const [
    showInsufficientBalanceModal,
    setShowInsufficientBalanceModal,
  ] = React.useState(false);
  const [state, setState] = React.useState({
    showDepositInfo: false,
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
    new TokenAmount(
      CELO[CHAIN_ID],
      // Only supports up to 2 decimal places
      BigNumber.from(100 * selectedAmount)
        .mul(BigNumber.from(10).pow(16))
        .toString()
    ),
    tornadoAddress
  );
  const [depositState, depositCallback] = useDepositCallback(selectedAmount);
  const getAccountBalance = useGetTokenBalance(CELO[CHAIN_ID], account);
  const getContractBalance = useGetTokenBalance(CELO[CHAIN_ID], tornadoAddress);
  React.useEffect(() => {
    getAccountBalance()
      .then((tokenAmount) => setAccountBalance(Number(tokenAmount.toExact())))
      .catch(console.error);
  }, [getAccountBalance, account]);
  React.useEffect(() => {
    getContractBalance()
      .then((tokenAmount) => {
        setContractBalance(Number(tokenAmount.toExact()));
      })
      .catch(console.error);
  }, [getContractBalance, tornadoAddress]);

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

  const approveHandler = async () => {
    if (!account) {
      return;
    }
    if (!accountBalance) {
      console.error("Tried approving without a defined account balance");
      return;
    }
    if (accountBalance < selectedAmount) {
      setShowInsufficientBalanceModal(true);
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
        setShowInsufficientBalanceModal(true);
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
    <Flex>
      {depositAmounts.map((depositAmount, index) => (
        <Label key={index} justifyContent="center">
          <Flex flexDirection="column" alignItems="center">
            <Radio
              value={depositAmount}
              checked={selectedAmount === depositAmount}
              onClick={() => setSelectedAmount(depositAmount)}
              disabled={AMOUNTS_DISABLED.includes(depositAmount)}
            />
            <Text>{depositAmount.toLocaleString()}</Text>
            <Text>CELO</Text>
          </Flex>
        </Label>
      ))}
    </Flex>
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
  if (showInsufficientBalanceModal) {
    insufficientBalanceModal = (
      <Modal
        modalClosed={() => setShowInsufficientBalanceModal(false)}
        show={showInsufficientBalanceModal}
      >
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

      {
        // TODO account shouldn't be a neccesary constraint
        account && contractBalance != null && (
          <p>
            Current number of deposits: {contractBalance / selectedAmount} CELO
          </p>
        )
      }

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
      {account && accountBalance != null && (
        <p>Balance: {accountBalance} CELO</p>
      )}
    </div>
  );
};

export default DepositPage;
