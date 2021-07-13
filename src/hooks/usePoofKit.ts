import React from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { PoofKitV2 } from "@poofcash/poof-kit";
import { createContainer } from "unstated-next";
import { CHAIN_ID } from "config";

const usePoofKit = () => {
  const { kit } = useContractKit();
  const [initializing, setInitializing] = React.useState(true);
  const poofKit = new PoofKitV2(kit, CHAIN_ID);
  // Recursively try to initialize
  const tryInit = async (firstTry: boolean) => {
    setTimeout(
      async () => {
        if (!window.groth16) {
          tryInit(false);
        }
        try {
          await poofKit.initialize(window.groth16);
          return setInitializing(false);
        } catch (e) {
          console.error("Failed to init PoofKit:", e);
          tryInit(false);
        }
      },
      firstTry ? 0 : 2500
    );
  };
  React.useEffect(() => {
    tryInit(true);
  });
  return { poofKit, poofKitLoading: initializing };
};

export const PoofKitGlobal = createContainer(usePoofKit);
