import { ChainId } from "@celo-tools/use-contractkit";

export const CURRENCY_MAP: Record<ChainId, Record<string, string>> = {
  [ChainId.Mainnet]: {
    scelo: "0x2879BFD5e7c4EF331384E908aaA3Bd3014b703fA",
    rcelo: "0x1a8Dbe5958c597a744Ba51763AbEBD3355996c3e",
    celo: "0x471ece3750da237f93b8e339c536989b8978a438",
  },
  [ChainId.Alfajores]: {
    scelo: "0xb9B532e99DfEeb0ffB4D3EDB499f09375CF9Bf07",
    rcelo: "0xBDeedCDA79BAbc4Eb509aB689895a3054461691e",
    celo: "0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9",
  },
  [ChainId.Baklava]: {
    scelo: "",
    rcelo: "",
    celo: "",
  },
};

export const SCELO_IDX_MAP = {
  [ChainId.Mainnet]: 0,
  [ChainId.Alfajores]: 1,
  [ChainId.Baklava]: 1,
};

export const RELAYERS = {
  [ChainId.Mainnet]: ["https://adamaris.privatedns.org"],
  [ChainId.Alfajores]: ["https://relayer-test.poof.cash"],
  [ChainId.Baklava]: [],
};

export const DECIMAL_PRECISION = 3; // Number of decimals to show

export const supportedCurrencies = ["rCELO", "CELO", "POOF"];
