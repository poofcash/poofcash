import React from "react";
import { Spinner, Text } from "theme-ui";

export const PoofKitLoading: React.FC = () => {
  return (
    <div>
      <Spinner />
      <Text>Initializing proof generation dependencies...</Text>
    </div>
  );
};
