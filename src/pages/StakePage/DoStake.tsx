import React from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useTranslation } from "react-i18next";
import {
  Button,
  Container,
  Flex,
  Grid,
  Input,
  Link,
  Spinner,
  Text,
} from "theme-ui";
import { toWei, AbiItem, toBN, isAddress, fromWei } from "web3-utils";
import { humanFriendlyWei } from "utils/eth";
import { STAKE_MAP } from "config";
import ERC20_ABI from "abis/ERC20.json";
import DUAL_REWARDS_ABI from "abis/MoolaStakingRewards.json";
import { GrayBox } from "components/GrayBox";
import { SummaryTable } from "components/SummaryTable";
import { useAsyncState } from "hooks/useAsyncState";
import { MoolaStakingRewards } from "generated/MoolaStakingRewards";
import { useDualStakeRewards } from "hooks/useDualStakeRewards";
import { useStakeRewards } from "hooks/useStakeRewards";
import { ActionDrawer } from "components/ActionDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";
import { MaxUint256 } from "@ethersproject/constants";
import { toastTx } from "utils/toastTx";
import { usePoofUbeStake } from "hooks/usePoofUbeStake";
import { usePoofPrice } from "hooks/usePoofPrice";
import { useUbePrice } from "hooks/useUbePrice";
import { apr } from "utils/interest";
import { humanFriendlyNumber } from "utils/number";

const WEEK_IN_SECONDS = 604800;

interface IProps {
  amount: string;
  setAmount: (amount: string) => void;
}

export const DoStake: React.FC<IProps> = ({ amount, setAmount }) => {
  const breakpoint = useBreakpoint();
  const { t } = useTranslation();
  const { kit, performActions, address, connect, network } = useContractKit();
  const stakeTokenCall = React.useCallback(async () => {
    const stakeToken = new kit.web3.eth.Contract(
      ERC20_ABI as AbiItem[],
      STAKE_MAP[network.chainId].stakeToken
    );
    if (!address || !isAddress(address)) {
      return ["0", "0"];
    }
    return await Promise.all([
      stakeToken.methods.balanceOf(address).call(),
      stakeToken.methods
        .allowance(address, STAKE_MAP[network.chainId].stakeRewards)
        .call(),
    ]);
  }, [kit, address, network]);
  const [
    [stakeTokenBalance, stakeTokenAllowance],
    refetchStakeToken,
  ] = useAsyncState(["0", "0"], stakeTokenCall);

  const [
    [externalFarmTotalSupply, externalFarmBalance, externalRewardRate],
    refetchStakeRewards,
  ] = useStakeRewards(
    STAKE_MAP[network.chainId].externalStakeRewards,
    STAKE_MAP[network.chainId].stakeRewards
  );
  const [
    [farmTotalSupply, farmBalance, earned, earnedExternal, rewardRate],
    refetchDualStakeRewards,
  ] = useDualStakeRewards(STAKE_MAP[network.chainId].stakeRewards, address);
  const [poofUbeStake] = usePoofUbeStake(
    farmBalance.eq(toBN(0))
      ? farmTotalSupply.toString()
      : farmBalance.toString()
  );
  const [poofPrice] = usePoofPrice();
  const [ubePrice] = useUbePrice();

  // Loaders
  const [unstakeLoading, setUnstakeLoading] = React.useState(false);
  const [claimLoading, setClaimLoading] = React.useState(false);
  const [approveLoading, setApproveLoading] = React.useState(false);
  const [stakeLoading, setStakeLoading] = React.useState(false);

  const refetch = () => {
    refetchStakeToken();
    refetchDualStakeRewards();
    refetchStakeRewards();
  };

  // Click handlers
  const onUnstakeClick = () => {
    setUnstakeLoading(true);
    performActions(async (kit) => {
      const stakingRewards = (new kit.web3.eth.Contract(
        DUAL_REWARDS_ABI as AbiItem[],
        STAKE_MAP[network.chainId].stakeRewards
      ) as unknown) as MoolaStakingRewards;
      try {
        const txo = stakingRewards.methods.exit();
        const tx = await txo.send({
          from: kit.defaultAccount,
          gasPrice: toWei("0.1", "gwei"),
        });
        toastTx(tx.transactionHash);
      } catch (e) {
        console.error(e);
      } finally {
        refetch();
        setUnstakeLoading(false);
      }
    });
  };

  const onStakeClick = () => {
    setStakeLoading(true);
    performActions(async (kit) => {
      const stakingRewards = (new kit.web3.eth.Contract(
        DUAL_REWARDS_ABI as AbiItem[],
        STAKE_MAP[network.chainId].stakeRewards
      ) as unknown) as MoolaStakingRewards;
      try {
        const txo = stakingRewards.methods.stake(toWei(amount));
        const tx = await txo.send({
          from: kit.defaultAccount,
          gasPrice: toWei("0.1", "gwei"),
        });
        toastTx(tx.transactionHash);
      } catch (e) {
        console.error(e);
      } finally {
        refetch();
        setStakeLoading(false);
      }
    });
  };

  const onApproveClick = () => {
    setApproveLoading(true);
    performActions(async (kit) => {
      const stakeToken = new kit.web3.eth.Contract(
        ERC20_ABI as AbiItem[],
        STAKE_MAP[network.chainId].stakeToken
      );
      try {
        const txo = stakeToken.methods.approve(
          STAKE_MAP[network.chainId].stakeRewards,
          MaxUint256.toString()
        );
        const tx = await txo.send({
          from: kit.defaultAccount,
          gasPrice: toWei("0.1", "gwei"),
        });
        toastTx(tx.transactionHash);
      } catch (e) {
        console.error(e);
      } finally {
        refetch();
        setApproveLoading(false);
      }
    });
  };

  const onClaimClick = () => {
    setClaimLoading(true);
    performActions(async (kit) => {
      const stakingRewards = (new kit.web3.eth.Contract(
        DUAL_REWARDS_ABI as AbiItem[],
        STAKE_MAP[network.chainId].stakeRewards
      ) as unknown) as MoolaStakingRewards;
      try {
        const txo = stakingRewards.methods.getReward();
        const tx = await txo.send({
          from: kit.defaultAccount,
          gasPrice: toWei("0.1", "gwei"),
        });
        toastTx(tx.transactionHash);
      } catch (e) {
        console.error(e);
      } finally {
        refetch();
        setClaimLoading(false);
      }
    });
  };

  const approveButton = approveLoading ? (
    <Spinner />
  ) : (
    <Button
      onClick={onApproveClick}
      disabled={!address || Number(amount) <= 0}
      sx={{ width: ["auto", "100%"] }}
      mr={2}
    >
      Approve
    </Button>
  );
  const stakeButton = stakeLoading ? (
    <Spinner />
  ) : (
    <Button
      onClick={onStakeClick}
      disabled={Number(amount) <= 0 || !address}
      sx={{ width: ["auto", "100%"] }}
      mr={2}
    >
      Stake
    </Button>
  );

  let button = (
    <Button
      variant="primary"
      onClick={() => connect().catch(console.warn)}
      sx={{ width: "100%" }}
    >
      Connect Wallet
    </Button>
  );

  if (
    toBN(stakeTokenAllowance).gte(toBN(toWei(amount === "" ? "0" : amount)))
  ) {
    button = stakeButton;
  } else {
    button = approveButton;
  }

  let boxContent = (
    <>
      <Text sx={{ mb: 4 }} variant="subtitle">
        {t("deposit.desktop.connectWallet.title")}
      </Text>
      <br />
      <Text variant="regularGray">
        {t("deposit.desktop.connectWallet.subtitle")}
      </Text>
    </>
  );

  if (address && amount === "0") {
    boxContent = (
      <>
        <Text sx={{ mb: 4 }} variant="subtitle">
          {t("stake.select.title")}
        </Text>
        <br />
        <Text variant="regularGray">{t("stake.select.subtitle")}</Text>
      </>
    );
  } else if (address) {
    boxContent = (
      <>
        <Text sx={{ mb: 4 }} variant="subtitle">
          {t("stake.review.title")}
        </Text>
        <br />
        <SummaryTable
          title="Summary"
          lineItems={[
            {
              label: "Stake amount",
              value: `${amount} ${STAKE_MAP[network.chainId].stakeTokenName}`,
            },
          ]}
          totalItem={{
            label: "Total",
            value: `${amount} ${STAKE_MAP[network.chainId].stakeTokenName}`,
          }}
        />
      </>
    );
  }

  let weeklyRewardRate = toBN(0);
  let weeklyExternalRewardRate = toBN(0);
  if (!farmTotalSupply.eq(toBN(0))) {
    weeklyRewardRate = rewardRate.mul(toBN(WEEK_IN_SECONDS));
    if (!farmBalance.eq(toBN(0))) {
      weeklyRewardRate = weeklyRewardRate.mul(farmBalance).div(farmTotalSupply);
    }
    if (!externalFarmTotalSupply.eq(toBN(0))) {
      weeklyExternalRewardRate = externalRewardRate.mul(toBN(WEEK_IN_SECONDS));
      if (!farmBalance.eq(toBN(0))) {
        weeklyExternalRewardRate = weeklyExternalRewardRate
          .mul(externalFarmBalance)
          .mul(farmBalance)
          .div(externalFarmTotalSupply)
          .div(farmTotalSupply);
      }
    }
  }

  const weeklyRewardUsd = Number(fromWei(weeklyRewardRate)) * poofPrice;
  const weeklyExternalRewardsUsd =
    Number(fromWei(weeklyExternalRewardRate)) * ubePrice;
  const stakeApr = apr(
    poofUbeStake,
    weeklyRewardUsd + weeklyExternalRewardsUsd,
    52
  );

  return (
    <Grid sx={{ gridTemplateColumns: ["1fr", "1.3fr 1fr"], gridGap: 6 }}>
      <Container>
        <Text sx={{ display: "block" }} variant="title">
          {t("stake.title")}
        </Text>
        <Text sx={{ display: "block", mb: 4 }} variant="regularGray">
          {t("stake.subtitle")}
        </Text>

        {/* Stake info */}
        <Flex sx={{ justifyContent: "space-between" }} mb={1}>
          <Text variant="form">Amount</Text>
          <Text sx={{ whiteSpace: "nowrap" }} variant="form">
            <Link
              onClick={() => {
                setAmount(fromWei(stakeTokenBalance));
              }}
            >
              max: {humanFriendlyWei(stakeTokenBalance)}
            </Link>
          </Text>
        </Flex>
        <Input
          type="number"
          sx={{ width: ["100%"], mb: 5 }}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Grid
          sx={{ alignItems: "center" }}
          columns={[2, "auto 1fr"]}
          gap={[3, 2]}
          mb={3}
        >
          <Text sx={{ textAlign: "right" }} variant="largeNumber">
            {`${humanFriendlyWei(farmBalance)} ${
              STAKE_MAP[network.chainId].stakeTokenName
            }`}
          </Text>
          <Text variant="regular">Current stake</Text>
          <Text sx={{ textAlign: "right" }} variant="largeNumber">
            {`${humanFriendlyWei(weeklyRewardRate).toString()} ${
              STAKE_MAP[network.chainId].rewardTokenName
            } + ${humanFriendlyWei(weeklyExternalRewardRate).toString()} ${
              STAKE_MAP[network.chainId].externalRewardTokenName
            }`}
          </Text>
          <Text variant="regular">Weekly rewards</Text>
          <Text sx={{ textAlign: "right" }} variant="largeNumber">
            {`${humanFriendlyWei(earned).toString()} ${
              STAKE_MAP[network.chainId].rewardTokenName
            } + ${humanFriendlyWei(earnedExternal).toString()} ${
              STAKE_MAP[network.chainId].externalRewardTokenName
            }`}
          </Text>
          <Text variant="regular">Rewards earned</Text>
          <Text sx={{ textAlign: "right" }} variant="largeNumber">
            {humanFriendlyNumber(stakeApr * 100)} %
          </Text>
          <Text variant="regular">APR</Text>
        </Grid>
        <Flex>
          {unstakeLoading ? (
            <Spinner />
          ) : (
            <Button
              variant="secondary"
              onClick={onUnstakeClick}
              disabled={farmBalance.lte(toBN(0))}
              sx={{ width: "100%" }}
              mr={2}
            >
              Unstake
            </Button>
          )}
          {claimLoading ? (
            <Spinner />
          ) : (
            <Button
              variant="secondary"
              onClick={onClaimClick}
              disabled={earned.lte(toBN(0)) && earnedExternal.lte(toBN(0))}
              sx={{ width: "100%" }}
              mr={2}
            >
              Claim
            </Button>
          )}
        </Flex>
      </Container>

      {breakpoint === Breakpoint.DESKTOP && (
        <Container>
          <GrayBox>{boxContent}</GrayBox>
          <Flex sx={{ justifyContent: "center" }}>
            {amount !== "" && toBN(stakeTokenAllowance).gte(toBN(toWei(amount)))
              ? stakeButton
              : approveButton}
          </Flex>
        </Container>
      )}

      {breakpoint === Breakpoint.MOBILE && (
        <ActionDrawer>
          {stakeLoading ? (
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
                amount={amount === "" ? "0" : amount}
                currency={STAKE_MAP[network.chainId].stakeTokenName}
              />
              {button}
            </Flex>
          )}
        </ActionDrawer>
      )}
    </Grid>
  );
};
