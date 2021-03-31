import React from "react";
import moment from "moment";
import { useWeb3React } from "@web3-react/core";
import { AMOUNTS_DISABLED, CHAIN_ID } from "config";
import { getNoteStringAndCommitment } from "utils/snarks-functions";
import Modal from "components/Modal";
import {
  useApproveCallback,
  ApprovalState,
  useDepositCallback,
  DepositState,
} from "hooks/writeContract";
import { TokenAmount, CELO } from "@ubeswap/sdk";
import { useInitValoraResponse } from "connectors/valora/valoraUtils";
import { instances } from "poof-token";
import {
  getDeposits,
  useGetTokenBalance,
  useTornadoDeposits,
} from "hooks/readContract";
import { BigNumber } from "@ethersproject/bignumber";
import { Button, Text, Spinner, Textarea } from "@theme-ui/components";
import { Flex, Grid, Select } from "theme-ui";
import { NetworkContextName } from "index";

type AmountToDeposits = {
  [depositAmount: string]: Array<any>;
};

// pass props and State interface to Component class
const DepositPage = () => {
  useInitValoraResponse();

  const { account } = useWeb3React();
  const { library: networkLibrary } = useWeb3React(NetworkContextName);

  const [selectedAmount, setSelectedAmount] = React.useState("");
  const [noteString, setNoteString] = React.useState("");
  const [accountBalance, setAccountBalance] = React.useState<number>();
  const [
    showInsufficientBalanceModal,
    setShowInsufficientBalanceModal,
  ] = React.useState(false);
  const [state, setState] = React.useState({
    showDepositInfo: false,
  });
  const [currency, setCurrency] = React.useState("celo");

  const tornadoAddress = React.useMemo(
    () =>
      instances[`netId${CHAIN_ID}`][currency].instanceAddress[selectedAmount],
    [currency, selectedAmount]
  );
  const depositAmounts = React.useMemo(
    () =>
      Object.keys(
        instances[`netId${CHAIN_ID}`][currency].instanceAddress
      ).sort(),
    [currency]
  );

  const [approvalState, approveCallback] = useApproveCallback(
    new TokenAmount(
      CELO[CHAIN_ID],
      // Only supports up to 2 decimal places
      selectedAmount !== ""
        ? BigNumber.from(100 * Number(selectedAmount))
            .mul(BigNumber.from(10).pow(16))
            .toString()
        : "0"
    ),
    tornadoAddress
  );
  const [depositState, depositCallback] = useDepositCallback(
    Number(selectedAmount)
  );

  const getAccountBalance = useGetTokenBalance(CELO[CHAIN_ID], account);
  React.useEffect(() => {
    if (account) {
      getAccountBalance()
        .then((tokenAmount) => setAccountBalance(Number(tokenAmount.toExact())))
        .catch(console.error);
    }
  }, [getAccountBalance, account]);

  const contractDeposits = useTornadoDeposits(tornadoAddress);
  const [
    amountToDeposits,
    setAmountToDeposits,
  ] = React.useState<AmountToDeposits>({});
  React.useEffect(() => {
    const fn = async () => {
      const res: AmountToDeposits = {};
      for (let i = 0; i < depositAmounts.length; i++) {
        const tornadoAddress =
          instances[`netId${CHAIN_ID}`][currency].instanceAddress[
            depositAmounts[i]
          ];
        res[depositAmounts[i]] = await getDeposits(
          networkLibrary,
          tornadoAddress
        );
      }
      return res;
    };
    fn().then((res) => setAmountToDeposits(res));
  }, [networkLibrary, currency, depositAmounts]);

  const loading =
    approvalState === ApprovalState.PENDING ||
    approvalState === ApprovalState.WAITING_CONFIRMATIONS ||
    depositState === DepositState.PENDING;

  const approveHandler = async () => {
    if (!account) {
      return;
    }
    if (!accountBalance) {
      console.error("Tried approving without a defined account balance");
      return;
    }
    if (accountBalance < Number(selectedAmount)) {
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
      if (accountBalance < Number(selectedAmount)) {
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

  let approveButton = (
    <Button
      variant="primary"
      onClick={approveHandler}
      disabled={!account || selectedAmount === ""}
    >
      Approve
    </Button>
  );

  let depositButton = <></>;
  if (account) {
    if (state.showDepositInfo) {
      depositButton = <></>;
    } else {
      depositButton = (
        <Button
          variant="primary"
          onClick={depositHandler}
          disabled={!account || selectedAmount === ""}
        >
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

  let button = approveButton;
  if (account) {
    if (approvalState === ApprovalState.NOT_APPROVED) {
      button = approveButton;
    } else {
      button = depositButton;
    }
  }

  return (
    <div>
      <Text variant="form">Currency</Text>
      <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value={currency}>CELO</option>
      </Select>

      <Text variant="form">Amount</Text>
      <Select
        value={selectedAmount}
        onChange={(e) => setSelectedAmount(e.target.value)}
      >
        <option value="">Select an amount</option>
        {depositAmounts.map((depositAmount, index) => (
          <option
            key={index}
            value={depositAmount}
            disabled={AMOUNTS_DISABLED.includes(depositAmount)}
          >
            {depositAmount.toLocaleString()} {currency.toUpperCase()}
          </option>
        ))}
      </Select>
      {account && accountBalance != null && (
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

      <Text sx={{ mt: 4 }} variant="subtitle">
        Anonymity Set
      </Text>
      <Text sx={{ mb: 4 }}>
        <strong>
          {(selectedAmount === ""
            ? Object.values(amountToDeposits).flatMap((x) => x).length
            : contractDeposits.length
          ).toLocaleString()}
        </strong>{" "}
        total deposits
      </Text>

      {selectedAmount === "" && (
        <Grid columns={[3]}>
          <Text variant="tableHeader">Deposits</Text>
          <Text variant="tableHeader">Activity</Text>
          <Text variant="tableHeader">Amount</Text>
          <div
            style={{
              margin: "-8px",
              height: "1px",
              gridColumnStart: 1,
              gridColumnEnd: 4,
              background: "black",
            }}
          ></div>
          {Object.entries(amountToDeposits)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([amount, deposits], idx) => {
              return (
                <React.Fragment key={idx}>
                  <Text variant="bold">{deposits.length.toLocaleString()}</Text>
                  <Text sx={{ width: "100%" }} variant="regular">
                    {deposits.length > 0
                      ? moment(
                          deposits[deposits.length - 1].timestamp * 1000
                        ).fromNow()
                      : "--"}
                  </Text>
                  <Text variant="bold">{amount}</Text>
                </React.Fragment>
              );
            })}
        </Grid>
      )}
      {selectedAmount !== "" && (
        <Grid columns={[2]}>
          <Text>Deposit ID</Text>
          <Text>Time</Text>
          {contractDeposits
            .map((deposit: any) => deposit.timestamp)
            .sort()
            .reverse()
            .slice(0, 5)
            .map((timestamp: number, idx: number) => (
              <>
                <Text>{(contractDeposits.length - idx).toLocaleString()}</Text>
                <Text>{moment(timestamp * 1000).fromNow()}</Text>
              </>
            ))}
        </Grid>
      )}

      {noteString !== "" && !loading && state.showDepositInfo && (
        <div>
          <h3>Success!</h3>
          <p>Keep this note. It allows you to withdraw anonymized CELO.</p>
          <Textarea readOnly rows={4} value={noteString} />
        </div>
      )}

      {insufficientBalanceModal}

      {loading ? (
        <>
          <Spinner />
          {loadingApprove}
          {loadingDeposit}
        </>
      ) : (
        <Flex sx={{ mt: 4, mr: 4, justifyContent: "flex-end" }}>{button}</Flex>
      )}
    </div>
  );
};

export default DepositPage;
