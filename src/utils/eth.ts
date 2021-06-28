import Wallet from "ethereumjs-wallet";
import { hexToBytes, fromWei } from "web3-utils";
import BN from "bn.js";
import { humanFriendlyNumber } from "utils/number";

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

export const humanFriendlyWei = (wei: BN | string) => {
  return humanFriendlyNumber(fromWei(wei));
};
