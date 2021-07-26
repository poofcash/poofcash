import React from "react";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { useAsyncState } from "hooks/useAsyncState";
import { getPoofEvents } from "utils/getPoofEvents";

export const usePoofEvents = (eventName: string) => {
  const { poofKit } = PoofKitGlobal.useContainer();
  const call = React.useCallback(async () => {
    return await getPoofEvents(eventName, poofKit);
  }, [poofKit, eventName]);
  return useAsyncState({}, call);
};
