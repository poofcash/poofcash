import { PoofKitV2 } from "@poofcash/poof-kit";
import { localForageVersion } from "config";
import localForage from "localforage";
import { EventData } from "web3-eth-contract";

export const getPoofEvents = async (
  eventName: string,
  poofKit: PoofKitV2
): Promise<Record<string, EventData[]>> => {
  const KEY = `${eventName}${localForageVersion}`;
  const pools = await poofKit.getAllPools();
  let events =
    (await localForage.getItem<Record<string, EventData[]>>(KEY)) || {};
  await Promise.all(
    pools.map(async (poolAddress) => {
      let lastBlock = 0;
      let cachedEvents: EventData[] = [];
      if (events[poolAddress] && events[poolAddress].length > 0) {
        cachedEvents = events[poolAddress];
        lastBlock = cachedEvents[cachedEvents.length - 1].blockNumber + 1;
      }
      const latestEvents = await poofKit.poofEvents(
        lastBlock,
        poolAddress,
        eventName
      );
      events[poolAddress] = cachedEvents.concat(...latestEvents);
    })
  );
  // Allow no async
  localForage.setItem(KEY, events);
  return events;
};
