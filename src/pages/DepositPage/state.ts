import { atom } from "recoil";
import { NoteStringCommitment } from "./types";

export const depositAmount = atom({
  key: "DEPOSIT_AMOUNT",
  default: "0",
});

export const depositActualAmount = atom({
  key: "DEPOSIT_ACTUAL_AMOUNT",
  default: "0",
});

export const depositCurrency = atom({
  key: "DEPOSIT_CURRENCY",
  default: "rCELO",
});

export const depositUsingCustom = atom({
  key: "DEPOSIT_USING_CUSTOM",
  default: true,
});

export const depositNotes = atom<NoteStringCommitment[]>({
  key: "DEPOSIT_NOTES",
  default: [],
});

export const depositBackup = atom({
  key: "DEPOSIT_BACKUP",
  default: true,
});
