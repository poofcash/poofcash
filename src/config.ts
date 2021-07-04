import { ChainId } from "@ubeswap/sdk";

export type ChainIdType = 42220 | 44787;
export const CHAIN_ID: ChainIdType =
  process.env.REACT_APP_CHAIN_ID === "42220" ? 42220 : 44787;

export const NETWORK = CHAIN_ID === ChainId.MAINNET ? "mainnet" : "alfajores";

export const CURRENCY_MAP: Record<string, string> =
  CHAIN_ID === ChainId.MAINNET
    ? {
        scelo: "0x2879BFD5e7c4EF331384E908aaA3Bd3014b703fA",
        rcelo: "0x1a8Dbe5958c597a744Ba51763AbEBD3355996c3e",
        celo: "0x471ece3750da237f93b8e339c536989b8978a438",
      }
    : {
        scelo: "0xb9B532e99DfEeb0ffB4D3EDB499f09375CF9Bf07",
        rcelo: "0xBDeedCDA79BAbc4Eb509aB689895a3054461691e",
        celo: "0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9",
      };

export const SCELO_IDX = CHAIN_ID === ChainId.MAINNET ? 0 : 1;

export const RPC_URL: string =
  NETWORK === "mainnet"
    ? "https://explorer.celo.org"
    : "https://alfajores-forno.celo-testnet.org";

export const RELAYERS = {
  mainnet: ["https://adamaris.privatedns.org"],
  alfajores: ["https://relayer-test.poof.cash"],
};

export const BLOCKSCOUT_URL =
  CHAIN_ID === 42220
    ? "https://explorer.celo.org"
    : "https://alfajores-blockscout.celo-testnet.org";

export const IP_URL = "https://ip.tornado.cash";

export const DECIMAL_PRECISION = 3; // Number of decimals to show

export const supportedCurrencies = ["rCELO", "CELO", "POOF"];

export const MINE_START = 1625745600;
