import React from "react";
import { CURRENCY_MAP } from "config";
import { useApprove } from "hooks/writeContract";
import { useTokenBalance } from "hooks/useTokenBalance";
import { Button, Text, Spinner } from "@theme-ui/components";
import { Box, Card, Divider, Flex, Input, Select } from "theme-ui";
import { ActionDrawer } from "components/ActionDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";
import { useContractKit } from "@celo-tools/use-contractkit";
import { toBN, fromWei, toWei } from "web3-utils";
import { humanFriendlyNumber } from "utils/number";
import { humanFriendlyWei } from "utils/eth";
import { deployments } from "@poofcash/poof-kit";
import { NoteList, NoteListMode } from "components/DepositList";
import { useRCeloPrice } from "hooks/useRCeloPrice";
import { usePoofPrice } from "hooks/usePoofPrice";
import { useCeloPrice } from "hooks/useCeloPrice";
import { apr } from "utils/interest";
import { MAX_NOTES } from "utils/notes";

interface IProps {
  onDepositClick?: () => void;
  setAmount: (amount: string) => void;
  amount: string;
  setCurrency: (currency: string) => void;
  currency: string;
  setUsingCustom: (usingCustom: boolean) => void;
  usingCustom: boolean;
  actualAmount: string;
  poofRate: string;
  apRate: string;
}

const supportedCurrencies = ["CELO", "rCELO"];

// pass props and State interface to Component class
export const PickDeposit: React.FC<IProps> = ({
  onDepositClick,
  amount,
  setAmount,
  currency,
  setCurrency,
  usingCustom,
  setUsingCustom,
  actualAmount,
  poofRate,
  apRate,
}) => {
  const { connect, address, network } = useContractKit();
  const breakpoint = useBreakpoint();

  const [allowance, approve, approveLoading] = useApprove(
    deployments[`netId${network.chainId}`][currency.toLowerCase()].tokenAddress,
    toWei(Number(actualAmount).toString())
  );

  const userBalance = useTokenBalance(
    CURRENCY_MAP[network.chainId][currency.toLowerCase()],
    address
  );
  const contractBalance = useTokenBalance(
    CURRENCY_MAP[network.chainId][currency.toLowerCase()],
    deployments[`netId${network.chainId}`][currency.toLowerCase()]
      .instanceAddress[amount.toLowerCase()]
  );

  const depositAmounts = React.useMemo(
    () =>
      Object.keys(
        deployments[`netId${network.chainId}`][currency.toLowerCase()]
          .instanceAddress
      ).sort(),
    [currency, network]
  );
  const [poofPrice] = usePoofPrice();
  const [celoPrice] = useCeloPrice();
  const [rCeloPrice] = useRCeloPrice();
  const poofRewardsUsd = Number(poofRate) * poofPrice;
  let depositApr = 0;
  if (Number(actualAmount) === 0) {
    depositApr = 0;
  } else if (currency.toLowerCase() === "celo") {
    depositApr = apr(Number(actualAmount) * celoPrice, poofRewardsUsd, 52);
  } else if (currency.toLowerCase() === "rcelo") {
    depositApr = apr(Number(actualAmount) * rCeloPrice, poofRewardsUsd, 52);
  }

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
    <Button variant="secondary" onClick={() => connect().then(console.warn)}>
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
      disabled={Number(actualAmount) === 0}
    >
      Approve
    </Button>
  );

  const depositButton = (
    <Button
      variant="secondary"
      onClick={depositHandler}
      disabled={Number(actualAmount) === 0}
    >
      Deposit
    </Button>
  );

  let button = connectWalletButton;
  if (address) {
    if (toBN(userBalance).lt(toBN(toWei(Number(actualAmount).toString())))) {
      button = insufficientBalanceButton;
    } else if (
      toBN(allowance).lt(toBN(toWei(Number(actualAmount).toString())))
    ) {
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
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
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
        Amount (max: {humanFriendlyWei(userBalance)} {currency})
      </Text>
      <Box mb={4}>
        <Flex mb={2}>
          <Box sx={{ width: "100%", mr: 2 }}>
            <Select
              value={usingCustom ? "custom" : amount}
              onChange={(e) => {
                if (e.target.value === "custom") {
                  setUsingCustom(true);
                } else {
                  setUsingCustom(false);
                  setAmount(e.target.value);
                }
              }}
            >
              <option value="0">Select an amount</option>
              {depositAmounts.map((depositAmount, index) => (
                <option key={index} value={depositAmount}>
                  {humanFriendlyNumber(depositAmount)} {currency}
                </option>
              ))}
              <option value="custom">Custom</option>
            </Select>
          </Box>
          {usingCustom && (
            <Input
              placeholder="Enter a custom amount"
              onChange={(e) => {
                const input = e.target.value;
                if (!isNaN(Number(input))) {
                  setAmount(input);
                }
              }}
              value={amount}
            />
          )}
        </Flex>
        {usingCustom && (
          <Card variant="warning">
            Note: Custom amounts may make up to {MAX_NOTES} deposits. On-chain
            backups are highly recommended
          </Card>
        )}
      </Box>

      {!usingCustom && amount !== "0" && (
        <Flex>
          <Text sx={{ mr: 1 }} variant="largeNumber">
            {(
              Number(fromWei(contractBalance)) / Number(amount)
            ).toLocaleString()}
          </Text>
          <Text variant="regular">active deposits</Text>
        </Flex>
      )}
      {actualAmount !== "0" && (
        <>
          <Flex mt={3}>
            <Text sx={{ mr: 1 }} variant="largeNumber">
              {Number(apRate).toLocaleString()}
            </Text>
            <Text variant="regular">AP / block</Text>
          </Flex>
          <Flex mt={3}>
            <Text sx={{ mr: 1 }} variant="largeNumber">
              {humanFriendlyNumber(poofRate)}
            </Text>
            <Text variant="regular">Est. POOF / week</Text>
          </Flex>
          <Flex mt={3}>
            <Text sx={{ mr: 1 }} variant="largeNumber">
              {humanFriendlyNumber(depositApr * 100)} %
            </Text>
            <Text variant="regular">APR</Text>
          </Flex>
        </>
      )}

      <Divider my={4} />
      <Box>
        <NoteList mode={NoteListMode.DEPOSITS} />
      </Box>

      {breakpoint === Breakpoint.MOBILE && (
        <ActionDrawer>
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
                amount={actualAmount}
                currency={currency}
              />
              {button}
            </Flex>
          )}
        </ActionDrawer>
      )}
    </>
  );
};
