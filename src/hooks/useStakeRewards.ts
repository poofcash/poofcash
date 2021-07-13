import React from "react";
import STAKING_REWARDS_ABI from "abis/StakingRewards.json";
import { Address } from "@celo/contractkit";
import { AbiItem, toBN, isAddress } from "web3-utils";
import { useAsyncState } from "hooks/useAsyncState";
import { useContractKit } from "@celo-tools/use-contractkit";
import { StakingRewards } from "generated/StakingRewards";

export const useStakeRewards = (address: Address, owner: Address | null) => {
  const { kit } = useContractKit();
  const stakeRewardsCall = React.useCallback(async () => {
    const stakeRewards = (new kit.web3.eth.Contract(
      STAKING_REWARDS_ABI as AbiItem[],
      address
    ) as unknown) as StakingRewards;
    if (!owner || !isAddress(owner)) {
      return [toBN(0), toBN(0), toBN(0)];
    }
    return await Promise.all([
      stakeRewards.methods.totalSupply().call().then(toBN),
      stakeRewards.methods.balanceOf(owner).call().then(toBN),
      stakeRewards.methods.rewardRate().call().then(toBN),
    ]);
  }, [kit, owner, address]);
  return useAsyncState([toBN(0), toBN(0), toBN(0)], stakeRewardsCall);
};
