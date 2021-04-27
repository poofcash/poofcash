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
const AMOUNTS_DISABLED: string[] = [];

const RELAYERS = {
  mainnet: [],
  alfajores: ["https://poof-relayer-alfajores.herokuapp.com"],
};

const BLOCKSCOUT_URL =
  CHAIN_ID === 42220
    ? "https://explorer.celo.org"
    : "https://alfajores-blockscout.celo-testnet.org";

const IP_URL = "https://ip.tornado.cash";

export {
  CHAIN_ID,
  RPC_URL,
  NETWORK,
  RELAYERS,
  AMOUNTS_DISABLED,
  BLOCKSCOUT_URL,
  IP_URL,
};
