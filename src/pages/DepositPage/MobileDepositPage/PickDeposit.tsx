import React from "react";
import moment from "moment";
import { useWeb3React } from "@web3-react/core";
import { AMOUNTS_DISABLED, CHAIN_ID } from "config";
import { useApproveCallback, ApprovalState } from "hooks/writeContract";
import { TokenAmount, CELO } from "@ubeswap/sdk";
import { instances } from "poof-token";
import {
  getDeposits,
  useGetTokenBalance,
  useTornadoDeposits,
} from "hooks/readContract";
import { BigNumber } from "@ethersproject/bignumber";
import { Button, Text, Spinner } from "@theme-ui/components";
import { Flex, Grid, Select } from "theme-ui";
import { NetworkContextName } from "index";
import { ConnectWallet } from "pages/ConnectWallet";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { TableDivider } from "components/TableDivider";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";
import { InsufficientBalanceModal } from "components/InsufficientBalanceModal";

interface IProps {
  onDepositClick?: () => void;
  setSelectedAmount: (amount: string) => void;
  selectedAmount: string;
  setSelectedCurrency: (currency: string) => void;
  selectedCurrency: string;
}

type AmountToDeposits = {
  [depositAmount: string]: Array<any>;
};

// pass props and State interface to Component class
export const PickDeposit: React.FC<IProps> = ({
  onDepositClick,
  selectedAmount,
  setSelectedAmount,
  selectedCurrency,
  setSelectedCurrency,
}) => {
  const { account } = useWeb3React();
  const { library: networkLibrary } = useWeb3React(NetworkContextName);
  const breakpoint = useBreakpoint();

  const [accountBalance, setAccountBalance] = React.useState<number>();
  const [
    showInsufficientBalanceModal,
    setShowInsufficientBalanceModal,
  ] = React.useState(false);
  const [showConnectWalletModal, setShowConnectWalletModal] = React.useState(
    false
  );

  const tornadoAddress = React.useMemo(
    () =>
      instances[`netId${CHAIN_ID}`][selectedCurrency].instanceAddress[
        selectedAmount
      ],
    [selectedCurrency, selectedAmount]
  );
  const depositAmounts = React.useMemo(
    () =>
      Object.keys(
        instances[`netId${CHAIN_ID}`][selectedCurrency].instanceAddress
      ).sort(),
    [selectedCurrency]
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
          instances[`netId${CHAIN_ID}`][selectedCurrency].instanceAddress[
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
  }, [networkLibrary, selectedCurrency, depositAmounts]);

  const loading =
    approvalState === ApprovalState.PENDING ||
    approvalState === ApprovalState.WAITING_CONFIRMATIONS;

  const approveHandler = async () => {
    if (!account) {
      return;
    }
    if (!accountBalance) {
      alert("Your account has insufficient funds.");
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
      onDepositClick && onDepositClick();
    } catch (error) {
      console.log("Error occured while making deposit");
      console.error(error);
    }
  };

  const connectWalletButton = (
    <Button variant="secondary" onClick={() => setShowConnectWalletModal(true)}>
      Connect Wallet
    </Button>
  );

  const approveButton = (
    <Button variant="secondary" onClick={approveHandler}>
      Approve
    </Button>
  );

  const depositButton = (
    <Button
      variant="secondary"
      onClick={depositHandler}
      disabled={selectedAmount === ""}
    >
      Deposit
    </Button>
  );

  let button = connectWalletButton;
  if (account) {
    if (approvalState === ApprovalState.NOT_APPROVED) {
      button = approveButton;
    } else {
      button = depositButton;
    }
  }

  return (
    <>
      <Text variant="form" sx={{ mb: 2 }}>
        Currency
      </Text>
      <Select
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value)}
      >
        <option value={selectedCurrency}>CELO</option>
      </Select>

      <Text sx={{ mt: 4, mb: 2 }} variant="form">
        Amount
      </Text>
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
            {depositAmount.toLocaleString()} {selectedCurrency.toUpperCase()}
          </option>
        ))}
      </Select>

      <Text sx={{ mb: 2, mt: 6 }} variant="form">
        Anonymity Set
      </Text>
      <Flex sx={{ mb: 4 }}>
        <Text sx={{ mr: 1 }} variant="largeNumber">
          {(selectedAmount === ""
            ? Object.values(amountToDeposits).flatMap((x) => x).length
            : contractDeposits.length
          ).toLocaleString()}
        </Text>
        <Text variant="regular">equal user deposits</Text>
      </Flex>

      {selectedAmount === "" && (
        <Grid sx={{ gridTemplateColumns: "auto fit-content auto" }}>
          <Text variant="tableHeader">Deposits</Text>
          <Text variant="tableHeader">Activity</Text>
          <Text sx={{ textAlign: "right" }} variant="tableHeader">
            Amount
          </Text>
          <TableDivider columns={3} />
          {Object.entries(amountToDeposits)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([amount, deposits], idx) => {
              return (
                <React.Fragment key={idx}>
                  <Text variant="bold">{deposits.length.toLocaleString()}</Text>
                  <Text sx={{ width: "100%" }} variant="regularGray">
                    {deposits.length > 0
                      ? moment(
                          deposits[deposits.length - 1].timestamp * 1000
                        ).fromNow()
                      : "--"}
                  </Text>
                  <Text sx={{ textAlign: "right" }} variant="bold">
                    {amount}
                  </Text>
                </React.Fragment>
              );
            })}
        </Grid>
      )}
      {selectedAmount !== "" && (
        <Grid sx={{ gridTemplateColumns: "fit-content auto" }}>
          <Text variant="tableHeader">Deposit ID</Text>
          <Text sx={{ textAlign: "right" }} variant="tableHeader">
            Time
          </Text>
          <TableDivider columns={2} />
          {contractDeposits
            .map((deposit: any) => deposit.timestamp)
            .sort()
            .reverse()
            .slice(0, 5)
            .map((timestamp: number, idx: number) => (
              <React.Fragment key={idx}>
                <Text variant="bold">
                  {(contractDeposits.length - idx).toLocaleString()}
                </Text>
                <Text sx={{ textAlign: "right" }} variant="regularGray">
                  {moment(timestamp * 1000).fromNow()}
                </Text>
              </React.Fragment>
            ))}
        </Grid>
      )}

      <InsufficientBalanceModal
        onClose={() => setShowInsufficientBalanceModal(false)}
        show={showInsufficientBalanceModal}
        neededAmount={selectedAmount}
      />

      <ConnectWallet
        isOpen={showConnectWalletModal}
        goBack={() => setShowConnectWalletModal(false)}
      />

      {breakpoint === Breakpoint.MOBILE && (
        <BottomDrawer>
          {loading ? (
            <Flex sx={{ justifyContent: "flex-end" }}>
              <Spinner />
            </Flex>
          ) : (
            <Flex
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <LabelWithBalance
                label="Total"
                amount={selectedAmount}
                currency={selectedCurrency.toUpperCase()}
              />
              {button}
            </Flex>
          )}
        </BottomDrawer>
      )}
    </>
  );
};
