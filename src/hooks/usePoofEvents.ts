import React from "react";
import { EventData } from "web3-eth-contract";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { useAsyncState } from "hooks/useAsyncState";
import localForage from "localforage";

export const usePoofEvents = (eventName: string) => {
  const { poofKit } = PoofKitGlobal.useContainer();
  const call = React.useCallback(async () => {
    let events = await localForage.getItem<Record<string, EventData[]>>(
      eventName
    );
    if (events) {
      const lastBlock = Math.max(
        ...Object.values(events).map((l) => {
          if (l.length === 0) {
            return 0;
          }
          return l[l.length - 1].blockNumber;
        })
      );
      const latestEvents = await poofKit.poofEvents(lastBlock, eventName);
      Object.entries(latestEvents).forEach(([addr, l]) => {
        if (events) {
          if (!events[addr]) {
            events[addr] = [];
          }
          events[addr] = events[addr].concat(...l);
        }
      });
    } else {
      events = await poofKit.depositEvents(0);
    }
    // Allow no async
    localForage.setItem(eventName, events);
    return events;
  }, [poofKit, eventName]);
  return useAsyncState({}, call);
};
