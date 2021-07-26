import { PoofKitV2 } from "@poofcash/poof-kit";
import localForage from "localforage";
import { EventData } from "web3-eth-contract";

export const getPoofEvents = async (eventName: string, poofKit: PoofKitV2) => {
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
    events = await poofKit.poofEvents(0, eventName);
  }
  // Allow no async
  localForage.setItem(eventName, events);
  return events;
};
