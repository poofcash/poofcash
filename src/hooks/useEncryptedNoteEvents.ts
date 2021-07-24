import React from "react";
import { EventData } from "web3-eth-contract";
import { PoofKitGlobal } from "./usePoofKit";
import { useAsyncState } from "./useAsyncState";
import localForage from "localforage";

const KEY = "EncryptedNote";

export const useEncryptedNoteEvents = () => {
  const { poofKit } = PoofKitGlobal.useContainer();
  const call = React.useCallback(async () => {
    let events = await localForage.getItem<EventData[]>(KEY);
    if (events && events.length > 0) {
      const lastEvent = events[events.length - 1];
      const lastBlock = lastEvent.blockNumber;
      events = events.concat(
        ...(await poofKit.encryptedNoteEvents(lastBlock + 1))
      );
    } else {
      events = await poofKit.encryptedNoteEvents(0);
    }
    await localForage.setItem(KEY, events);
    return events;
  }, [poofKit]);
  return useAsyncState([], call);
};
