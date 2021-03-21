const CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID || "42220");

const NETWORK = CHAIN_ID === 42220 ? "mainnet" : "alfajores";

const RPC_URL: string =
  NETWORK === "mainnet"
    ? "https://explorer.celo.org"
    : "https://alfajores-forno.celo-testnet.org";

const TORNADO_INSTANCES_ADDRESSES: any = {
  alfajores: {
    celo: {
      0.1: "0xBdD116cF6B447d038B83b018a1E3f044163b6b44",
    },
  },
};

// Do not allow the user to choose the following amounts
const AMOUNTS_DISABLED: number[] = [];

const TOKEN_ADDRESS = {
  alfajores: {
    celo: "0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9",
  },
};

const RELAYER_URL = "https://poof-relayer.herokuapp.com";
// const RELAYER_URL = "http://localhost:8000";

export {
  CHAIN_ID,
  RPC_URL,
  TORNADO_INSTANCES_ADDRESSES,
  TOKEN_ADDRESS,
  NETWORK,
  RELAYER_URL,
  AMOUNTS_DISABLED,
};
