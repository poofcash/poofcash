import React from "react";
import DUAL_REWARDS_ABI from "abis/MoolaStakingRewards.json";
import { Address } from "@celo/contractkit";
import { AbiItem, toBN, isAddress } from "web3-utils";
import { MoolaStakingRewards } from "generated/MoolaStakingRewards";
import { useAsyncState } from "hooks/useAsyncState";
import { useContractKit } from "@celo-tools/use-contractkit";

export const useDualStakeRewards = (
  address: Address,
  owner: Address | null
) => {
  const { kit } = useContractKit();
  const stakeRewardsCall = React.useCallback(async () => {
    const stakeRewards = (new kit.web3.eth.Contract(
      DUAL_REWARDS_ABI as AbiItem[],
      address
    ) as unknown) as MoolaStakingRewards;
    const [totalSupply, rewardRate] = await Promise.all([
      stakeRewards.methods.totalSupply().call().then(toBN),
      stakeRewards.methods.rewardRate().call().then(toBN),
    ]);
    if (!owner || !isAddress(owner)) {
      return [totalSupply, toBN(0), toBN(0), toBN(0), rewardRate];
    }
    const [farmBalance, earned, earnedExternal] = await Promise.all([
      stakeRewards.methods.balanceOf(owner).call().then(toBN),
      stakeRewards.methods.earned(owner).call().then(toBN),
      stakeRewards.methods
        .earnedExternal(owner)
        .call()
        .then((v) => toBN(v[0])), // Hardcode: Only 1 external reward
    ]);
    return [totalSupply, farmBalance, earned, earnedExternal, rewardRate];
  }, [kit, owner, address]);
  return useAsyncState(
    [toBN(0), toBN(0), toBN(0), toBN(0), toBN(0), toBN(0)],
    stakeRewardsCall
  );
};
