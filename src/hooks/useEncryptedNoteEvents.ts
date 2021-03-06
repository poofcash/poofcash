import React from "react";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { useAsyncState } from "hooks/useAsyncState";
import { getEncryptedNoteEvents } from "utils/getEncryptedNoteEvents";

export const useEncryptedNoteEvents = () => {
  const { poofKit } = PoofKitGlobal.useContainer();
  const call = React.useCallback(async () => {
    return await getEncryptedNoteEvents(poofKit);
  }, [poofKit]);
  return useAsyncState([], call);
};
