import React from "react";
import { AMOUNTS_DISABLED, CHAIN_ID } from "config";
import { useApproveCallback, ApprovalState } from "hooks/writeContract";
import { CELO } from "@ubeswap/sdk";
import { poofTokenConfig } from "@poofcash/poof-kit";
import { useGetTokenBalance } from "hooks/readContract";
import { Button, Text, Spinner } from "@theme-ui/components";
import { Flex, Select } from "theme-ui";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";
import { InsufficientBalanceModal } from "components/InsufficientBalanceModal";
import { useContractKit } from "@celo-tools/use-contractkit";
import { toBN } from "web3-utils";

interface IProps {
  onDepositClick?: () => void;
  setSelectedAmount: (amount: string) => void;
  selectedAmount: string;
  setSelectedCurrency: (currency: string) => void;
  selectedCurrency: string;
}

// pass props and State interface to Component class
export const PickDeposit: React.FC<IProps> = ({
  onDepositClick,
  selectedAmount,
  setSelectedAmount,
  selectedCurrency,
  setSelectedCurrency,
}) => {
  const { connect, address } = useContractKit();
  const breakpoint = useBreakpoint();

  const [accountBalance, setAccountBalance] = React.useState<number>();
  const [contractBalance, setContractBalance] = React.useState(0);
  const [
    showInsufficientBalanceModal,
    setShowInsufficientBalanceModal,
  ] = React.useState(false);

  const tornadoAddress = React.useMemo(
    () =>
      poofTokenConfig.instances[`netId${CHAIN_ID}`][selectedCurrency]
        .instanceAddress[selectedAmount],
    [selectedCurrency, selectedAmount]
  );

  const [approvalState, approveCallback] = useApproveCallback(
    CELO[CHAIN_ID].address,
    // Only supports up to 2 decimal places
    selectedAmount !== ""
      ? toBN(100 * Number(selectedAmount)).mul(toBN(10).pow(toBN(16)))
      : toBN("0")
  );

  const getAccountBalance = useGetTokenBalance(CELO[CHAIN_ID], address);
  React.useEffect(() => {
    if (address) {
      getAccountBalance()
        .then((tokenAmount) => setAccountBalance(Number(tokenAmount.toExact())))
        .catch(console.error);
    }
  }, [getAccountBalance, address]);

  const getContractBalance = useGetTokenBalance(CELO[CHAIN_ID], tornadoAddress);
  React.useEffect(() => {
    if (tornadoAddress) {
      getContractBalance()
        .then((tokenAmount) =>
          setContractBalance(Number(tokenAmount.toExact()))
        )
        .catch(console.error);
    }
  }, [getContractBalance, tornadoAddress]);

  const depositAmounts = React.useMemo(
    () =>
      Object.keys(
        poofTokenConfig.instances[`netId${CHAIN_ID}`][selectedCurrency]
          .instanceAddress
      ).sort(),
    [selectedCurrency]
  );

  const loading =
    approvalState === ApprovalState.PENDING ||
    approvalState === ApprovalState.WAITING_CONFIRMATIONS;

  const approveHandler = async () => {
    if (!address) {
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
    if (!address) {
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
    <Button variant="secondary" onClick={connect}>
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
  if (address) {
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
        mb={4}
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value)}
      >
        <option value={selectedCurrency}>CELO</option>
      </Select>

      <Text sx={{ mt: 4, mb: 2 }} variant="form">
        Amount
      </Text>
      <Select
        mb={4}
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

      {selectedAmount !== "" && (
        <Flex>
          <Text sx={{ mr: 1 }} variant="largeNumber">
            {(contractBalance / Number(selectedAmount)).toLocaleString()}
          </Text>
          <Text variant="regular">active deposits</Text>
        </Flex>
      )}

      <InsufficientBalanceModal
        onClose={() => setShowInsufficientBalanceModal(false)}
        show={showInsufficientBalanceModal}
        neededAmount={selectedAmount}
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
