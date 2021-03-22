import { ChainId } from "@ubeswap/sdk";

type ChainIdType = 42220 | 44787;
const CHAIN_ID: ChainIdType =
  process.env.REACT_APP_CHAIN_ID === "42220" ? 42220 : 44787;

const NETWORK = CHAIN_ID === ChainId.MAINNET ? "mainnet" : "alfajores";

const RPC_URL: string =
  NETWORK === "mainnet"
    ? "https://explorer.celo.org"
    : "https://alfajores-forno.celo-testnet.org";

// Do not allow the user to choose the following amounts
const AMOUNTS_DISABLED: number[] = [];

const TOKEN_ADDRESS = {
  alfajores: {
    celo: "0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9",
  },
};

const RELAYER_URL =
  CHAIN_ID === ChainId.MAINNET
    ? "https://poof-relayer-prod.herokuapp.com"
    : "https://poof-relayer.herokuapp.com";
// const RELAYER_URL = "http://localhost:8000";

const BLOCKSCOUT_URL =
  CHAIN_ID === 42220
    ? "https://explorer.celo.org"
    : "https://alfajores-blockscout.celo-testnet.org";

export {
  CHAIN_ID,
  RPC_URL,
  TOKEN_ADDRESS,
  NETWORK,
  RELAYER_URL,
  AMOUNTS_DISABLED,
  BLOCKSCOUT_URL,
};
