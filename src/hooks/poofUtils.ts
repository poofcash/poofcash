import React from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { PoofKitV2 } from "@poofcash/poof-kit";
import { fromWei } from "web3-utils";
import { createContainer } from "unstated-next";
import { CHAIN_ID } from "config";

export const usePoofAmount = (amount: number | string) => {
  const { poofKit } = PoofKitGlobal.useContainer();
  const [poofAmount, setPoofAmount] = React.useState<string | undefined>();
  React.useEffect(() => {
    poofKit
      .ap2Poof(Number(amount))
      .then((poofAmount) => setPoofAmount(fromWei(poofAmount)))
      .catch(console.error);
  });
  if (Number(amount) === 0) {
    return "0";
  }
  return poofAmount || "0";
};

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
