import { Contract } from "web3-eth-contract";
import merkleTree from "lib/MerkleTree";
const randomBytes = require("crypto").randomBytes;
const circomlib = require("circomlib");
const { bigInt } = require("snarkjs");
const assert = require("assert");
const websnarkUtils = require("websnark/src/utils");
const rbigint = (nbytes: number) => bigInt.leBuff2int(randomBytes(nbytes));
const MERKLE_TREE_HEIGHT = 20;

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

const getNoteStringAndCommitment = (
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
  const noteString: string = `poof-${currency}-${amount}-${netId}-${note}`;
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
const parseNote = (noteString: string) => {
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

const createDeposit = (nullifier: string, secret: string) => {
  let deposit: any = { nullifier, secret };
  deposit.preimage = Buffer.concat([
    deposit.nullifier.leInt2Buff(31),
    deposit.secret.leInt2Buff(31),
  ]);
  deposit.commitment = pedersenHash(deposit.preimage);
  deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31));
  return deposit;
};

const generateProof = async ({
  deposit,
  recipient,
  rewardAccount = 0,
  fee = 0,
  refund = 0,
  tornado,
}: any) => {
  // Compute merkle proof of our commitment
  const { root, path_elements, path_index } = await generateMerkleProof(
    deposit,
    tornado
  );

  // Prepare circuit input
  const input = {
    // Public snark inputs
    root: root,
    nullifierHash: deposit.nullifierHash,
    recipient: bigInt(recipient),
    relayer: bigInt(rewardAccount),
    fee: bigInt(fee),
    refund: bigInt(refund),

    // Private snark inputs
    nullifier: deposit.nullifier,
    secret: deposit.secret,
    pathElements: path_elements,
    pathIndices: path_index,
  };

  console.log("Generating SNARK proof");
  console.time("Proof time");

  const circuit = await (
    await fetch(
      "https://cloudflare-ipfs.com/ipfs/QmbX8PzkcU1SQwUis3zDWEKsn8Yjgy2vALNeghVM2uh31B"
    )
  ).json();
  const provingKey = await (
    await fetch(
      "https://cloudflare-ipfs.com/ipfs/QmQwgF8aWJzGSXoe1o3jrEPdcfBysWctB2Uwu7uRebXe2D"
    )
  ).arrayBuffer();
  // generate proof data
  const proofData = await window.genZKSnarkProofAndWitness(
    input,
    circuit,
    provingKey
  );
  const { proof } = websnarkUtils.toSolidityInput(proofData);
  console.timeEnd("Proof generated.");

  const args = [
    toHex(input.root),
    toHex(input.nullifierHash),
    toHex(input.recipient, 20),
    toHex(input.relayer, 20),
    toHex(input.fee),
    toHex(input.refund),
  ];

  return { proof, args };
};

async function generateMerkleProof(deposit: any, tornado: Contract) {
  // Get all deposit events from smart contract and assemble merkle tree from them
  console.log("Getting current state from tornado contract");
  const events = await tornado.getPastEvents("Deposit", {
    fromBlock: 0,
    toBlock: "latest",
  });
  const leaves = events
    .sort(
      (a: any, b: any) => a.returnValues.leafIndex - b.returnValues.leafIndex
    ) // Sort events in chronological order
    .map((e: any) => e.returnValues.commitment);
  const tree = new merkleTree(MERKLE_TREE_HEIGHT, leaves);

  // Find current commitment in the tree
  const depositEvent = events.find(
    (event: any) => event.returnValues.commitment === toHex(deposit.commitment)
  );
  const leafIndex = depositEvent ? depositEvent.returnValues.leafIndex : -1;

  // Validate that our data is correct
  const isValidRoot = await tornado.methods
    .isKnownRoot(toHex(await tree.root()))
    .call();
  const isSpent = await tornado.methods
    .isSpent(toHex(deposit.nullifierHash))
    .call();
  assert(isValidRoot === true, "Merkle tree is corrupted");
  assert(isSpent === false, "The note is already spent");
  assert(leafIndex >= 0, "The deposit is not found in the tree");

  // Compute merkle proof of our commitment
  return tree.path(leafIndex);
}

export { getNoteStringAndCommitment, parseNote, generateProof, createDeposit };
