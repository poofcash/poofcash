import React from "react";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { useAsyncState } from "hooks/useAsyncState";

// TODO: Reduce rpc usage by having a `useMiningRate`
export const useMiningRates = () => {
  const { poofKit } = PoofKitGlobal.useContainer();
  const call = React.useCallback(async () => {
    return await poofKit.miningRates();
  }, [poofKit]);
  return useAsyncState<Record<string, number>>({}, call);
};
