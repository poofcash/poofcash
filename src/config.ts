import { ChainId } from "@ubeswap/sdk";

export type ChainIdType = 42220 | 44787;
export const CHAIN_ID: ChainIdType =
  process.env.REACT_APP_CHAIN_ID === "42220" ? 42220 : 44787;

export const NETWORK = CHAIN_ID === ChainId.MAINNET ? "mainnet" : "alfajores";

export const SCELO =
  CHAIN_ID === ChainId.MAINNET
    ? "0x2879BFD5e7c4EF331384E908aaA3Bd3014b703fA"
    : "0xb9B532e99DfEeb0ffB4D3EDB499f09375CF9Bf07";

export const RCELO =
  CHAIN_ID === ChainId.MAINNET
    ? "0x1a8Dbe5958c597a744Ba51763AbEBD3355996c3e"
    : "0xBDeedCDA79BAbc4Eb509aB689895a3054461691e";
export const SCELO_IDX = CHAIN_ID === ChainId.MAINNET ? 0 : 1;

export const RPC_URL: string =
  NETWORK === "mainnet"
    ? "https://explorer.celo.org"
    : "https://alfajores-forno.celo-testnet.org";

// Do not allow the user to choose the following amounts
export const AMOUNTS_DISABLED: string[] = [];

export const RELAYERS = {
  mainnet: ["https://adamaris.now.im"],
  alfajores: ["https://relayer-test.poof.cash"],
};

export const BLOCKSCOUT_URL =
  CHAIN_ID === 42220
    ? "https://explorer.celo.org"
    : "https://alfajores-blockscout.celo-testnet.org";

export const IP_URL = "https://ip.tornado.cash";
