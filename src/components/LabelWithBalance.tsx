import React from "react";
import { Text } from "@theme-ui/components";

interface IProps {
  label: string;
  amount: string | number;
  currency: string;
}

const PRECISION = 2 + 2;

export const humanFriendlyNumber = (v: number | string) => {
  let res = v !== "" ? v.toLocaleString().slice(0, PRECISION) : 0;
  if (Number(v) > 0 && Number(v) < 1e-2) {
    res = "<0.01";
  }
  return res;
};

export const LabelWithBalance: React.FC<IProps> = ({
  label,
  amount,
  currency,
}) => {
  const amountLabel = humanFriendlyNumber(amount);
  return (
    <span>
      <Text sx={{ mb: 2 }} variant="form">
        {label}
      </Text>
      <br />
      <Text variant="largeNumber">
        {amountLabel} {currency}
      </Text>
    </span>
  );
};
