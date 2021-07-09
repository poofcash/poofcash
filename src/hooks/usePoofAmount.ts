import React from "react";
import { fromWei } from "web3-utils";
import { PoofKitGlobal } from "./usePoofKit";

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
