import React from "react";
import moment from "moment";
import { useWeb3React } from "@web3-react/core";
import { AMOUNTS_DISABLED, CHAIN_ID } from "config";
import { getNoteStringAndCommitment } from "utils/snarks-functions";
import Modal from "components/Modal";
import { ledger, valora } from "connectors";
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
import { useGetTokenBalance, useTornadoDeposits } from "hooks/readContract";
import { BigNumber } from "@ethersproject/bignumber";
import { Label, Radio } from "@rebass/forms";
import { Button, Flex, Text, Spinner, Textarea } from "@theme-ui/components";
import { Card, Grid } from "theme-ui";
import styled from "@emotion/styled";
import { BlockscoutAddressLink } from "components/Links";

const ButtonsWrapper = styled.div({
  marginTop: "16px",
});

// pass props and State interface to Component class
const DepositPage = () => {
  useInitValoraResponse();

  const { activate, account } = useWeb3React();
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
    if (account) {
      getAccountBalance()
        .then((tokenAmount) => setAccountBalance(Number(tokenAmount.toExact())))
        .catch(console.error);
    }
  }, [getAccountBalance, account]);
  React.useEffect(() => {
    getContractBalance()
      .then((tokenAmount) => {
        setContractBalance(Number(tokenAmount.toExact()));
      })
      .catch(console.error);
  }, [getContractBalance, tornadoAddress]);

  const deposits = useTornadoDeposits(tornadoAddress);

  const loading =
    approvalState === ApprovalState.PENDING ||
    approvalState === ApprovalState.WAITING_CONFIRMATIONS ||
    depositState === DepositState.PENDING;

  const connectLedgerWallet = async () => {
    await activate(ledger, undefined, true).catch(alert);
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
    <Grid columns={[2]}>
      {depositAmounts.map((depositAmount, index) => (
        <Label key={index} justifyContent="center">
          <Flex css={{ flexDirection: "column", alignItems: "center" }}>
            <Radio
              value={depositAmount}
              checked={selectedAmount === depositAmount}
              onChange={() => setSelectedAmount(depositAmount)}
              disabled={AMOUNTS_DISABLED.includes(depositAmount)}
            />
            <Text>{depositAmount.toLocaleString()}</Text>
            <Text>CELO</Text>
          </Flex>
        </Label>
      ))}
    </Grid>
  );

  // show deposit information is available
  let depositInfo = <></>;
  if (noteString !== "" && !loading && state.showDepositInfo) {
    depositInfo = (
      <div>
        <h3>Success!</h3>
        <p>Keep this note. It allows you to withdraw anonymized CELO.</p>
        <Textarea readOnly rows={4} value={noteString} />
      </div>
    );
  }

  let approveButton = (
    <Button variant="primary" onClick={approveHandler}>
      Approve
    </Button>
  );

  let connectWalletButtons = (
    <div>
      <Button variant="primary" onClick={connectLedgerWallet}>
        Connect with Ledger
      </Button>
      <br />
      <br />
      <Button variant="primary" onClick={connectValoraWallet}>
        Connect with Valora
      </Button>
    </div>
  );

  let depositButton = <></>;
  if (account) {
    if (state.showDepositInfo) {
      depositButton = <></>;
    } else {
      depositButton = (
        <Button variant="primary" onClick={depositHandler}>
          Deposit
        </Button>
      );
    }
  }

  let loadingApprove = <></>;
  if (approvalState === ApprovalState.PENDING) {
    loadingApprove = (
      <div>
        <p>Sending approve transaction...</p>
      </div>
    );
  } else if (approvalState === ApprovalState.WAITING_CONFIRMATIONS) {
    loadingApprove = (
      <div>
        <p>Waiting for confirmations...</p>
      </div>
    );
  }

  let loadingDeposit = <></>;
  if (depositState === DepositState.PENDING) {
    loadingDeposit = (
      <div>
        <p>Sending deposit transaction...</p>
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
      <h3>Specify a CELO amount to deposit</h3>

      <Flex css={{ justifyContent: "space-evenly", flexWrap: "wrap" }}>
        {amountOptions}
        <Card>
          {contractBalance != null && (
            <p>
              Current number of deposits:{" "}
              {Math.ceil(contractBalance / selectedAmount)}
            </p>
          )}

          <h4>Last 5 deposits</h4>
          {deposits.length > 0 ? (
            <Grid columns={[2]}>
              {deposits
                .map((deposit: any) => deposit.timestamp)
                .sort()
                .reverse()
                .slice(0, 5)
                .map((timestamp: number, idx: number) => (
                  <p key={idx}>
                    ({idx + 1}) {moment(timestamp * 1000).fromNow()}
                  </p>
                ))}
            </Grid>
          ) : (
            <p>There are no deposits in this contract.</p>
          )}
        </Card>
      </Flex>

      {depositInfo}

      {insufficientBalanceModal}

      {loading ? (
        <>
          <Spinner />
          {loadingApprove}
          {loadingDeposit}
        </>
      ) : (
        <ButtonsWrapper>{button}</ButtonsWrapper>
      )}
      {account && (
        <>
          <span>
            <Text
              sx={{
                fontSize: 2,
                fontWeight: "bold",
              }}
            >
              Account:{" "}
            </Text>
            <BlockscoutAddressLink address={account}>
              <Text sx={{ fontSize: 2 }}>{account}</Text>
            </BlockscoutAddressLink>
          </span>
          {accountBalance != null && (
            <span>
              <Text
                sx={{
                  fontSize: 2,
                  fontWeight: "bold",
                }}
              >
                Account balance:{" "}
              </Text>
              <Text sx={{ fontSize: 2 }}>{accountBalance} CELO</Text>
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default DepositPage;
