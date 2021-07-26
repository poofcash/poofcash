import { atom } from "recoil";

export const mineNote = atom({
  key: "MINE_NOTE",
  default: "",
});

export const mineTxHash = atom({
  key: "MINE_TX_HASH",
  default: "",
});
