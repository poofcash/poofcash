import localForage from "localforage";
import { PoofKitV2 } from "@poofcash/poof-kit";
import { EventData } from "web3-eth-contract";
import { localForageVersion } from "config";

export const getMinerEvents = async (eventName: string, poofKit: PoofKitV2) => {
  const KEY = `${eventName}${localForageVersion}`;
  let events = await localForage.getItem<EventData[]>(KEY);
  if (events && events.length > 0) {
    const lastEvent = events[events.length - 1];
    const lastBlock = lastEvent.blockNumber;
    events = events.concat(
      ...(await poofKit.minerEvents(eventName, lastBlock + 1))
    );
  } else {
    events = await poofKit.minerEvents(eventName, 0);
  }
  await localForage.setItem(KEY, events);
  return events;
};
