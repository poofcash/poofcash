import React from "react";
import { CURRENCY_MAP } from "config";
import { useApprove } from "hooks/writeContract";
import { useTokenBalance } from "hooks/useTokenBalance";
import { Button, Text, Spinner } from "@theme-ui/components";
import { Box, Divider, Flex, Input, Select } from "theme-ui";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";
import { useContractKit } from "@celo-tools/use-contractkit";
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
  setUsingCustom: (usingCustom: boolean) => void;
  usingCustom: boolean;
  setCustomAmount: (amount: string) => void;
  customAmount: string;
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
  usingCustom,
  setUsingCustom,
  customAmount,
  setCustomAmount,
  poofRate,
  apRate,
}) => {
  const { connect, address, network } = useContractKit();
  const breakpoint = useBreakpoint();
  const { depositList } = DepositListGlobal.useContainer();

  const [allowance, approve, approveLoading] = useApprove(
    deployments[`netId${network.chainId}`][selectedCurrency.toLowerCase()]
      .tokenAddress,
    toWei(selectedAmount)
  );

  const userBalance = useTokenBalance(
    CURRENCY_MAP[network.chainId][selectedCurrency.toLowerCase()],
    address
  );
  const contractBalance = useTokenBalance(
    CURRENCY_MAP[network.chainId][selectedCurrency.toLowerCase()],
    deployments[`netId${network.chainId}`][selectedCurrency.toLowerCase()]
      .instanceAddress[selectedAmount.toLowerCase()]
  );

  const depositAmounts = React.useMemo(
    () =>
      Object.keys(
        deployments[`netId${network.chainId}`][selectedCurrency.toLowerCase()]
          .instanceAddress
      ).sort(),
    [selectedCurrency, network]
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

  const amount = usingCustom ? customAmount : selectedAmount;
  const approveButton = (
    <Button
      variant="secondary"
      onClick={() =>
        approve().catch((e) => {
          console.error(e);
          alert(e);
        })
      }
      disabled={amount === "0"}
    >
      Approve
    </Button>
  );

  const depositButton = (
    <Button
      variant="secondary"
      onClick={depositHandler}
      disabled={amount === "0"}
    >
      Deposit
    </Button>
  );

  let button = connectWalletButton;
  if (address) {
    if (toBN(userBalance).lt(toBN(toWei(amount)))) {
      button = insufficientBalanceButton;
    } else if (toBN(allowance).lt(toBN(toWei(amount)))) {
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
      <Box mb={4}>
        <Flex mb={2}>
          <Box sx={{ width: "100%", mr: 2 }}>
            <Select
              value={amount}
              onChange={(e) => {
                if (e.target.value === "custom") {
                  setUsingCustom(true);
                } else {
                  setUsingCustom(false);
                  setSelectedAmount(e.target.value);
                }
              }}
            >
              <option value="0">Select an amount</option>
              {depositAmounts.map((depositAmount, index) => (
                <option key={index} value={depositAmount}>
                  {humanFriendlyNumber(depositAmount)} {selectedCurrency}
                </option>
              ))}
              <option value="custom">Custom</option>
            </Select>
          </Box>
          {usingCustom && (
            <Input
              placeholder="Enter a custom amount"
              onChange={(e) => {
                setCustomAmount(e.target.value);
              }}
              value={customAmount}
            />
          )}
        </Flex>
        {usingCustom && (
          <Text>
            NOTE: Custom amounts may make multiple deposits. On-chain backups
            are highly recommended
          </Text>
        )}
      </Box>

      {!usingCustom && selectedAmount !== "0" && (
        <Flex>
          <Text sx={{ mr: 1 }} variant="largeNumber">
            {(
              Number(fromWei(contractBalance)) / Number(selectedAmount)
            ).toLocaleString()}
          </Text>
          <Text variant="regular">active deposits</Text>
        </Flex>
      )}
      {amount !== "0" && (
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
                amount={amount}
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
