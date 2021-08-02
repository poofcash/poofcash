import {
  Pair,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
} from "@ubeswap/sdk";
import UbeswapPairAbi from "abis/UbeswapPair.json";
import { UbeswapPair } from "generated/UbeswapPair";
import { AbiItem } from "web3-utils";
import { ContractKit } from "@celo/contractkit";

export const getUbeswapTrade = async (
  kit: ContractKit,
  tokenA: Token,
  tokenB: Token,
  input: TokenAmount
) => {
  const pairAddress = Pair.getAddress(tokenA, tokenB);
  const pairContract = (new kit.web3.eth.Contract(
    UbeswapPairAbi as AbiItem[],
    pairAddress
  ) as unknown) as UbeswapPair;

  const {
    reserve0,
    reserve1,
  } = await pairContract.methods.getReserves().call();
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA];
  const pair = new Pair(
    new TokenAmount(token0, reserve0),
    new TokenAmount(token1, reserve1)
  );
  const route = new Route([pair], input.token);
  return new Trade(route, input, TradeType.EXACT_INPUT);
};
