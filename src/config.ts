// const NETWORK = 'mainnet';
const NETWORK = "alfajores";

// const RPC_URL: string =
const RPC_URL: string = "https://alfajores-forno.celo-testnet.org";

const TORNADO_INSTANCES_ADDRESSES: any = {
  alfajores: {
    0.1: "0xBdD116cF6B447d038B83b018a1E3f044163b6b44",
  },
};

// BTC deposit amount options which show up in th UI (sort the amounts from the lowest to the highest)
const DEPOSIT_AMOUNTS: number[] = Object.keys(
  TORNADO_INSTANCES_ADDRESSES[NETWORK]
)
  .sort()
  .map(Number);

// Do not allow the user to choose the following amounts
const AMOUNTS_DISABLED: number[] = [];

const TOKEN_ADDRESS = {
  alfajores: "0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9",
};

const PAYMASTER_ADDRESS = "0x55Ef931a040b28657c53c9847de05d81456380Ff";

// demo private key without 0x
const DEMO_PRIVATE_KEY =
  "F8D46A5469433C4369BA77749B760F46208066F92EB9D9DCC31F26D4355DE157";

// used to get anonymity set size using TheGraph
const THE_GRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/benesjan/tbtc-tornado";

const RELAYER_URL = "https://poof-relayer.herokuapp.com";

const SERVER_URL = "http://192.168.1.14:5000";

export {
  RPC_URL,
  DEPOSIT_AMOUNTS,
  TORNADO_INSTANCES_ADDRESSES,
  TOKEN_ADDRESS,
  PAYMASTER_ADDRESS,
  NETWORK,
  THE_GRAPH_URL,
  RELAYER_URL,
  SERVER_URL,
  AMOUNTS_DISABLED,
  DEMO_PRIVATE_KEY,
};
