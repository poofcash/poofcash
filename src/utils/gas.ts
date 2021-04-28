import { BigNumber } from "@ethersproject/bignumber";

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
    .div(BigNumber.from(10000));
}

export function calculateFee({
  gasPrices,
  currency,
  amount,
  refund = 0,
  celoPrices,
  poofServiceFee,
  decimals,
}: {
  gasPrices: any;
  currency: string;
  amount: number;
  refund?: number;
  celoPrices: any;
  poofServiceFee: number;
  decimals: number;
}) {
  // gas price is in gwei. Convert to CELO
  const gasExpense = gasPrices[1.3] * Math.pow(10, 9) * 5 * Math.pow(10, 5);
  const serviceFee = amount * (poofServiceFee / 100) * Math.pow(10, decimals);
  let totalExpense = 0;
  switch (currency) {
    case "celo": {
      totalExpense = gasExpense + serviceFee;
    }
  }
  return Math.floor(totalExpense);
}
