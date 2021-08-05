import { atom } from "recoil";

export const redeemMaxAmount = atom<string | null>({
  key: "REDEEM_MAX_AMOUNT",
  default: null,
});
