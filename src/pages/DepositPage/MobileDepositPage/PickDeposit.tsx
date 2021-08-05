import React from "react";
import { CURRENCY_MAP } from "config";
import { useApprove } from "hooks/writeContract";
import { useTokenBalance } from "hooks/useTokenBalance";
import { Button, Text, Spinner } from "@theme-ui/components";
import {
  Box,
  Card,
  Checkbox,
  Container,
  Flex,
  Input,
  Link,
  Select,
} from "theme-ui";
import { ActionDrawer } from "components/ActionDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";
import { useContractKit } from "@celo-tools/use-contractkit";
import { toBN, fromWei, toWei } from "web3-utils";
import { humanFriendlyNumber } from "utils/number";
import { humanFriendlyWei } from "utils/eth";
import { deployments } from "@poofcash/poof-kit";
import { MAX_NOTES } from "utils/notes";
import { DepositStats } from "components/Deposit/DepositStats";
import { NoteList } from "components/NoteList";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { useMiningRate } from "hooks/useMiningRate";
import { useRecoilState } from "recoil";
import { depositBackup } from "../state";

interface IProps {
  onDepositClick?: () => void;
  setAmount: (amount: string) => void;
  amount: string;
  setCurrency: (currency: string) => void;
  currency: string;
  setUsingCustom: (usingCustom: boolean) => void;
  usingCustom: boolean;
  actualAmount: string;
  notes?: NoteStringCommitment[];
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
  notes,
}) => {
  const [backup, setBackup] = useRecoilState(depositBackup);
  const { connect, address, network } = useContractKit();
  const { poofRate, apRate, depositApr } = useMiningRate();
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
  const [confirmed, setConfirmed] = React.useState(false);

  const depositAmounts = React.useMemo(
    () =>
      Object.keys(
        deployments[`netId${network.chainId}`][currency.toLowerCase()]
          .instanceAddress
      ).sort(),
    [currency, network]
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
    <Button onClick={() => connect().then(console.warn)}>Connect Wallet</Button>
  );

  const insufficientBalanceButton = (
    <Button disabled={true}>Insufficient Balance</Button>
  );

  const approveButton = (
    <Button
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
      onClick={depositHandler}
      disabled={(() => {
        if (Number(actualAmount) === 0) {
          return true;
        }
        if (breakpoint === Breakpoint.DESKTOP && !confirmed) {
          return true;
        }
        return false;
      })()}
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

      <Box mb={4}>
        <Flex mb={2}>
          <Box sx={{ width: "100%", mr: 2 }}>
            <Text sx={{ mt: 4, mb: 2 }} variant="form">
              Amount
            </Text>
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
            <Box>
              <Container sx={{ textAlign: "right" }}>
                <Text sx={{ whiteSpace: "nowrap" }} variant="form">
                  <Link
                    sx={{ maxWidth: "100%" }}
                    onClick={() => {
                      setAmount(fromWei(userBalance));
                    }}
                  >
                    max: {humanFriendlyWei(userBalance)}
                  </Link>
                </Text>
              </Container>
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
            </Box>
          )}
        </Flex>
        {usingCustom && (
          <Card variant="warning" mt={4}>
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

      {breakpoint === Breakpoint.MOBILE && actualAmount !== "0" && (
        <DepositStats
          apRate={apRate}
          poofRate={poofRate}
          depositApr={depositApr}
        />
      )}

      {breakpoint === Breakpoint.DESKTOP && (
        <Container mt={4}>
          {notes && notes.length > 0 && (
            <>
              <Text sx={{ display: "block" }} variant="form">
                Magic Password
              </Text>
              <NoteList notes={notes.map((note) => note.noteString)} />
              <Flex
                sx={{ mt: 4, alignItems: "center" }}
                onClick={() => setConfirmed(!confirmed)}
              >
                <Checkbox readOnly checked={confirmed} />
                <Text sx={{ pt: 1 }}>I backed up the Magic Password(s)</Text>
              </Flex>
              <Flex
                sx={{ mt: 4, alignItems: "center" }}
                onClick={() => setBackup(!backup)}
              >
                <Checkbox readOnly checked={backup} />
                <Text sx={{ pt: 1 }}>Create an on-chain backup</Text>
              </Flex>
            </>
          )}
          <Box mt={4}>{loading ? <Spinner /> : button}</Box>
        </Container>
      )}

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
