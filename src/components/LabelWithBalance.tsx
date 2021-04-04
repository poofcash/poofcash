import React from "react";
import { Text } from "@theme-ui/components";

interface IProps {
  label: string;
  amount: string;
  currency: string;
}

export const LabelWithBalance: React.FC<IProps> = ({
  label,
  amount,
  currency,
}) => {
  return (
    <span>
      <Text
        sx={{
          fontSize: 2,
          fontWeight: "bold",
        }}
      >
        {label}
      </Text>
      <Text variant="largeNumber">
        {amount !== "" ? amount : 0} {currency}
      </Text>
    </span>
  );
};
