import React from "react";
import { useContractKit } from "@ubeswap/use-contractkit";
import { PoofKitV2 } from "@poofcash/poof-kit";
import { createContainer } from "unstated-next";
import { CHAIN_ID } from "config";

const usePoofKit = () => {
  const { kit } = useContractKit();
  const [initializing, setInitializing] = React.useState(true);
  const poofKit = new PoofKitV2(kit, CHAIN_ID);
  // Recursively try to initialize
  const tryInit = () => {
    return poofKit
      .initialize(window.groth16)
      .then(() => setInitializing(false))
      .catch((e) => {
        console.error("Failed to init PoofKit:", e);
        tryInit();
      });
  };
  React.useEffect(() => {
    tryInit();
  });
  return { poofKit, poofKitLoading: initializing };
};

export const PoofKitGlobal = createContainer(usePoofKit);
