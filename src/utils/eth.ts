import Wallet from "ethereumjs-wallet";
import { hexToBytes } from "web3-utils";

export const isPrivateKey = (privateKey: string) => {
  if (privateKey.length < 2) {
    return false;
  }
  let with0x = privateKey;
  if (privateKey.slice(0, 2) !== "0x") {
    with0x = `0x${privateKey}`;
  }

  try {
    Wallet.fromPrivateKey(Buffer.from(hexToBytes(with0x)));
    return true;
  } catch (e) {
    console.log(e);
  }
  return false;
};
