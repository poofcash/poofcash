import { ChainId } from "@celo-tools/use-contractkit";

export const CURRENCY_MAP: Record<ChainId, Record<string, string>> = {
  [ChainId.Mainnet]: {
    scelo: "0x2879BFD5e7c4EF331384E908aaA3Bd3014b703fA",
    bitcelo: "0x97775f815206daeb81188af20940def61c7d6d3b",
    vcapcelo: "0x5d4e32975bcf3aca47282c580cf5bc0f8135d218",
    ucelo: "0xb05e342117f7cce1646e0016804bcaa09741c593",
    tptcelo: "0x5afdb9c5a20ee5bb36d9c81bd5e1be56fbf52cd8",
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

export const rCELOMap: Record<ChainId, Record<string, number>> = {
  [ChainId.Mainnet]: {
    scelo: 0,
    bitcelo: 1,
    vcapcelo: 2,
    ucelo: 3,
    tptcelo: 4,
  },
  [ChainId.Alfajores]: {
    scelo: 1,
  },
  [ChainId.Baklava]: {
    scelo: -1,
  },
};

export const RELAYERS = {
  [ChainId.Mainnet]: [
    "https://adamaris.mooo.com",
    "https://bellagio.mooo.com",
    "https://maralago.mooo.com",
    "https://aarde.thkpool.com",
    "https://privatecelo.com",
    "https://poof.vercel.app"
  ],
  [ChainId.Alfajores]: ["https://relayer-test.poof.cash"],
  [ChainId.Baklava]: [],
};

export const DECIMAL_PRECISION = 3; // Number of decimals to show

export const supportedCurrencies = ["rCELO", "CELO", "POOF"];

export const STAKE_MAP: Record<ChainId, Record<string, string>> = {
  [ChainId.Mainnet]: {
    stakeToken: "0x573bcebd09ff805ed32df2cb1a968418dc74dcf7",
    stakeTokenName: "POOF-UBE ULP",
    stakeRewards: "0x969D7653ddBAbb42589d73EfBC2051432332A940",
    externalStakeRewards: "0xC88B8d622c0322fb59ae4473D7A1798DE60785dD",
    externalRewardToken: "0x00be915b9dcf56a3cbe739d9b9c202ca692409ec",
    externalRewardTokenName: "UBE",
    rewardToken: "0x00400FcbF0816bebB94654259de7273f4A05c762",
    rewardTokenName: "POOF",
  },
  [ChainId.Alfajores]: {
    stakeToken: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9",
    stakeTokenName: "CELO",
    stakeRewards: "0x2239262E6f60F4ac3cDBb209554c3F394b5c8DE4",
    externalStakeRewards: "0x8AFa37B058b492F1dE94BDfccf61e16FE098d064",
    externalRewardToken: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9",
    externalRewardTokenName: "CELO",
    rewardToken: "0x00400FcbF0816bebB94654259de7273f4A05c762",
    rewardTokenName: "POOF",
  },
  [ChainId.Baklava]: {
    stakeToken: "",
    stakeRewards: "",
    externalRewardToken: "",
    rewardToken: "",
  },
};

export const exchangeCurrencies = [
  "CELO",
  "sCELO",
  "bitCELO",
  "vcapCELO",
  "uCELO",
  "tptCELO",
  "rCELO",
];

export const UBESWAP_ROUTER = "0xE3D8bd6Aed4F159bc8000a9cD47CffDb95F96121";

export const localForageVersion = 1;

export const REFUND_CONTRACT = "0x03bF99A32C07a14cFEd35c1bD4c92fD39531c9b2";
