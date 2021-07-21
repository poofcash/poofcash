export const apr = (
  principal: number,
  periodReward: number,
  periods: number
) => {
  const totalRewards = periodReward * periods;
  return totalRewards / principal;
};

export const apy = (
  principal: number,
  periodReward: number,
  periods: number
) => {
  const annual = apr(principal, periodReward, periods);
  return ((1 + annual / periods) ^ periods) - 1;
};
