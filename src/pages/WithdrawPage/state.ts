import { atom } from "recoil";

export const withdrawNote = atom({
  key: "WITHDRAW_NOTE",
  default: "",
});

export const withdrawRecipient = atom({
  key: "WITHDRAW_RECIPIENT",
  default: "",
});

export const withdrawTxHash = atom({
  key: "WITHDRAW_TX_HASH",
  default: "",
});
