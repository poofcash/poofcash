import merkleTree from 'lib/MerkleTree';
const randomBytes = require('crypto').randomBytes;
const circomlib = require('circomlib');
const {bigInt} = require('snarkjs');
const assert = require('assert');
const websnarkUtils = require('websnark/src/utils');
const rbigint = (nbytes: number) => bigInt.leBuff2int(randomBytes(nbytes));
const MERKLE_TREE_HEIGHT = 20;
const COMMITMENT_IDX = 0;
const LEAF_INDEX_IDX = 1;

// Compute pedersen hash
const pedersenHash = (data: object) => circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];

// BigNumber to hex string of specified length
const toHex = (number: any, length = 32) =>
  '0x' + (number instanceof Buffer ? number.toString('hex') : bigInt(number).toString(16)).padStart(length * 2, '0');

const getNoteStringAndCommitment = (currency: string, amount: number, netId: number) => {
  const nullifier = rbigint(31);
  const secret = rbigint(31);
  // get snarks note and commitment
  const preimage = Buffer.concat([nullifier.leInt2Buff(31), secret.leInt2Buff(31)]);
  let commitment = pedersenHash(preimage);
  const note: string = toHex(preimage, 62);
  const noteString: string = `tornado-${currency}-${amount}-${netId}-${note}`;
  commitment = toHex(commitment);
  return {noteString, commitment};
};

/**
 * Parses Tornado.cash note
 * @param noteString the note
 */
const parseNote = (noteString: string) => {
  const noteRegex = /tornado-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g;
  let match = noteRegex.exec(noteString);
  if (!match) {
    throw new Error('The note has invalid format');
  }

  let matchGroup: any = match.groups;
  const buf = Buffer.from(matchGroup.note, 'hex');
  const nullifier = bigInt.leBuff2int(buf.slice(0, 31));
  const secret = bigInt.leBuff2int(buf.slice(31, 62));
  const deposit = createDeposit(nullifier, secret);
  const netId = Number(matchGroup.netId);

  return {currency: matchGroup.currency, amount: matchGroup.amount, netId, deposit: deposit};
};

const createDeposit = (nullifier: string, secret: string) => {
  let deposit: any = {nullifier, secret};
  deposit.preimage = Buffer.concat([deposit.nullifier.leInt2Buff(31), deposit.secret.leInt2Buff(31)]);
  deposit.commitment = pedersenHash(deposit.preimage);
  deposit.nullifierHash = pedersenHash(deposit.nullifier.leInt2Buff(31));
  return deposit;
};

const generateProof = async ({deposit, recipient, relayerAddress = 0, fee = 0, refund = 0, tornado}: any) => {
  // Compute merkle proof of our commitment
  const {root, path_elements, path_index} = await generateMerkleProof(deposit, tornado);

  // Prepare circuit input
  const input = {
    // Public snark inputs
    root: root,
    nullifierHash: deposit.nullifierHash,
    recipient: bigInt(recipient),
    relayer: bigInt(relayerAddress),
    fee: bigInt(fee),
    refund: bigInt(refund),

    // Private snark inputs
    nullifier: deposit.nullifier,
    secret: deposit.secret,
    pathElements: path_elements,
    pathIndices: path_index,
  };

  console.log('Generating SNARK proof');
  console.time('Proof time');

  const circuit = await (await fetch('withdraw.json')).json();
  const provingKey = await (await fetch('withdraw_proving_key.bin')).arrayBuffer();
  console.log(circuit, provingKey);
  // generate proof data
  const proofData = await window.genZKSnarkProofAndWitness(input, circuit, provingKey);
  const {proof} = websnarkUtils.toSolidityInput(proofData);
  console.timeEnd('Proof generated. Proof time');

  const args = [
    toHex(input.root),
    toHex(input.nullifierHash),
    toHex(input.recipient, 20),
    toHex(input.relayer, 20),
    toHex(input.fee),
    toHex(input.refund),
  ];

  return {proof, args};
};

async function generateMerkleProof(deposit: any, tornado: any) {
  // Get all deposit events from smart contract and assemble merkle tree from them
  console.log('Getting current state from tornado contract');
  const depositFilter = await tornado.filters.Deposit();
  const events = await tornado.queryFilter(depositFilter, 0, 'latest');
  const leaves = events
    .sort((a: any, b: any) => a.args[LEAF_INDEX_IDX] - b.args[LEAF_INDEX_IDX]) // Sort events in chronological order
    .map((e: any) => e.args[COMMITMENT_IDX]);
  const tree = new merkleTree(MERKLE_TREE_HEIGHT, leaves);

  // Find current commitment in the tree
  const depositEvent = events.find((event: any) => event.args[COMMITMENT_IDX] === toHex(deposit.commitment));
  const leafIndex = depositEvent ? depositEvent.args[LEAF_INDEX_IDX] : -1;

  // Validate that our data is correct
  const isValidRoot = await tornado.isKnownRoot(toHex(await tree.root()));
  const isSpent = await tornado.isSpent(toHex(deposit.nullifierHash));
  assert(isValidRoot === true, 'Merkle tree is corrupted');
  assert(isSpent === false, 'The note is already spent');
  assert(leafIndex >= 0, 'The deposit is not found in the tree');

  // Compute merkle proof of our commitment
  return tree.path(leafIndex);
}

export {getNoteStringAndCommitment, parseNote, generateProof, createDeposit};
