import localForage from "localforage";
import { PoofKitV2 } from "@poofcash/poof-kit";
import { EventData } from "web3-eth-contract";

const KEY = "EncryptedNote";

export const getEncryptedNoteEvents = async (poofKit: PoofKitV2) => {
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
};
