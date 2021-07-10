import React from "react";
import { CHAIN_ID, CURRENCY_MAP } from "config";
import { useApprove } from "hooks/writeContract";
import { useTokenBalance } from "hooks/readContract";
import { Button, Text, Spinner } from "@theme-ui/components";
import { Box, Divider, Flex, Select } from "theme-ui";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";
import { InsufficientBalanceModal } from "components/InsufficientBalanceModal";
import { useContractKit } from "@ubeswap/use-contractkit";
import { toBN, fromWei, toWei } from "web3-utils";
import { humanFriendlyNumber } from "utils/number";
import { humanFriendlyWei } from "utils/eth";
import { deployments } from "@poofcash/poof-kit";
import { DepositListGlobal } from "components/DepositList";

interface IProps {
  onDepositClick?: () => void;
  setSelectedAmount: (amount: string) => void;
  selectedAmount: string;
  setSelectedCurrency: (currency: string) => void;
  selectedCurrency: string;
  poofRate: string;
  apRate: string;
}

const supportedCurrencies = ["CELO", "rCELO"];

// pass props and State interface to Component class
export const PickDeposit: React.FC<IProps> = ({
  onDepositClick,
  selectedAmount,
  setSelectedAmount,
  selectedCurrency,
  setSelectedCurrency,
  poofRate,
  apRate,
}) => {
  const { connect, address } = useContractKit();
  const breakpoint = useBreakpoint();
  const { depositList } = DepositListGlobal.useContainer();

  const [
    showInsufficientBalanceModal,
    setShowInsufficientBalanceModal,
  ] = React.useState(false);

  const [allowance, approve, approveLoading] = useApprove(
    deployments[`netId${CHAIN_ID}`][selectedCurrency.toLowerCase()]
      .tokenAddress,
    toWei(selectedAmount)
  );

  const userBalance = useTokenBalance(
    CURRENCY_MAP[selectedCurrency.toLowerCase()],
    address
  );
  const contractBalance = useTokenBalance(
    CURRENCY_MAP[selectedCurrency.toLowerCase()],
    deployments[`netId${CHAIN_ID}`][selectedCurrency.toLowerCase()]
      .instanceAddress[selectedAmount.toLowerCase()]
  );

  const depositAmounts = React.useMemo(
    () =>
      Object.keys(
        deployments[`netId${CHAIN_ID}`][selectedCurrency.toLowerCase()]
          .instanceAddress
      ).sort(),
    [selectedCurrency]
  );

  const loading = approveLoading;

  const depositHandler = async () => {
    try {
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

  const insufficientBalanceButton = (
    <Button variant="secondary" disabled={true}>
      Insufficient Balance
    </Button>
  );

  const approveButton = (
    <Button
      variant="secondary"
      onClick={() =>
        approve().catch((e) => {
          console.error(e);
          alert(e);
        })
      }
      disabled={selectedAmount === "0"}
    >
      Approve
    </Button>
  );

  const depositButton = (
    <Button
      variant="secondary"
      onClick={depositHandler}
      disabled={selectedAmount === "0"}
    >
      Deposit
    </Button>
  );

  let button = connectWalletButton;
  if (address) {
    if (toBN(userBalance).lt(toBN(toWei(selectedAmount)))) {
      button = insufficientBalanceButton;
    } else if (toBN(allowance).lt(toBN(toWei(selectedAmount)))) {
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
        {supportedCurrencies.map((currency, idx) => {
          return (
            <option value={currency} key={idx}>
              {currency}
            </option>
          );
        })}
      </Select>

      <Text sx={{ mt: 4, mb: 2 }} variant="form">
        Amount (max: {humanFriendlyWei(userBalance)} {selectedCurrency})
      </Text>
      <Select
        mb={4}
        value={selectedAmount}
        onChange={(e) => setSelectedAmount(e.target.value)}
      >
        <option value="0">Select an amount</option>
        {depositAmounts.map((depositAmount, index) => (
          <option key={index} value={depositAmount}>
            {humanFriendlyNumber(depositAmount)} {selectedCurrency}
          </option>
        ))}
      </Select>

      {selectedAmount !== "0" && (
        <Flex>
          <Text sx={{ mr: 1 }} variant="largeNumber">
            {(
              Number(fromWei(contractBalance)) / Number(selectedAmount)
            ).toLocaleString()}
          </Text>
          <Text variant="regular">active deposits</Text>
        </Flex>
      )}
      {selectedAmount !== "0" && (
        <>
          <Flex mt={3}>
            <Text sx={{ mr: 1 }} variant="largeNumber">
              {Number(apRate).toLocaleString()}
            </Text>
            <Text variant="regular">AP / block</Text>
          </Flex>
          <Flex mt={3}>
            <Text sx={{ mr: 1 }} variant="largeNumber">
              {humanFriendlyWei(poofRate)}
            </Text>
            <Text variant="regular">Est. POOF / week</Text>
          </Flex>
        </>
      )}

      <Divider my={4} />
      <Box>{depositList}</Box>

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
                currency={selectedCurrency}
              />
              {button}
            </Flex>
          )}
        </BottomDrawer>
      )}
    </>
  );
};
