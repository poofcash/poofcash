import React from "react";
import { Text } from "@theme-ui/components";

interface IProps {
  label: string;
  amount: string | number;
  currency: string;
}

const PRECISION = 2 + 2;

export const LabelWithBalance: React.FC<IProps> = ({
  label,
  amount,
  currency,
}) => {
  let amountLabel =
    amount !== "" ? amount.toLocaleString().slice(0, PRECISION) : 0;
  if (Number(amount) < 1e-2) {
    amountLabel = "<0.01";
  }
  return (
    <span>
      <Text sx={{ mb: 2 }} variant="form">
        {label}
      </Text>
      <Text variant="largeNumber">
        {amountLabel} {currency}
      </Text>
    </span>
  );
};
