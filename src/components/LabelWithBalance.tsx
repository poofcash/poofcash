import React from "react";
import { Text } from "@theme-ui/components";
import { humanFriendlyNumber } from "utils/number";
import { formatCurrency } from "utils/currency";

interface IProps {
  label: string;
  amount: string | number;
  currency: string;
}

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
        {amountLabel} {formatCurrency(currency)}
      </Text>
    </span>
  );
};
