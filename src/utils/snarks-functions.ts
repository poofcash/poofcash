import circomlib from "circomlib";
import { bigInt } from "snarkjs";
import { randomBytes } from "crypto";

const rbigint = (nbytes: number) => bigInt.leBuff2int(randomBytes(nbytes));

// Compute pedersen hash
const pedersenHash = (data: object) =>
  circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];

// BigNumber to hex string of specified length
export const toHex = (number: any, length = 32) =>
  "0x" +
  (number instanceof Buffer
    ? number.toString("hex")
    : bigInt(number).toString(16)
  ).padStart(length * 2, "0");

export const getNoteStringAndCommitment = (
  currency: string,
  amount: string,
  netId: number
) => {
  const nullifier = rbigint(31);
  const secret = rbigint(31);
  // get snarks note and commitment
  const preimage = Buffer.concat([
    nullifier.leInt2Buff(31),
    secret.leInt2Buff(31),
  ]);
  let commitment = pedersenHash(preimage);
  const note: string = toHex(preimage, 62);
  const noteString: string = `poof-${currency.toLowerCase()}-${amount}-${netId}-${note}`;
  commitment = toHex(commitment);
  return { noteString, commitment };
};

export const isValidNote = (noteString: string) => {
  const noteRegex = /poof-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g;
  let match = noteRegex.exec(noteString);
  return Boolean(match);
};

/**
 * Parses Poof.cash note
 * @param noteString the note
 */
export const parseNote = (noteString: string) => {
  if (!isValidNote(noteString)) {
    return {};
  }
  const noteRegex = /poof-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g;
  let match = noteRegex.exec(noteString);
  if (!match) {
    throw new Error("The note has invalid format");
  }

  let matchGroup: any = match.groups;
  const buf = Buffer.from(matchGroup.note, "hex");
  const nullifier = bigInt.leBuff2int(buf.slice(0, 31));
  const secret = bigInt.leBuff2int(buf.slice(31, 62));
  const deposit = createDeposit(nullifier, secret);
  const netId = Number(matchGroup.netId);

  return {
    currency: matchGroup.currency,
    amount: matchGroup.amount,
    netId,
    deposit: deposit,
  };
};

export const createDeposit = (nullifier: string, secret: string) => {
  let deposit: any = { nullifier, secret };
  deposit.preimage = Buffer.concat([
    deposit.nullifier.leInt2Buff(31),
    deposit.secret.leInt2Buff(31),
  ]);
  deposit.commitment = pedersenHash(deposit.preimage);
  deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31));
  return deposit;
};
