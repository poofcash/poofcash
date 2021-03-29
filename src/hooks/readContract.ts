import { useEffect, useMemo, useState } from "react";
import { Token, TokenAmount } from "@ubeswap/sdk";
import { getContract, useTokenContract } from "hooks/getContract";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import ERC20_TORNADO_ABI from "abis/erc20tornado.json";
import { NetworkContextName } from "index";

type MethodArg = string | number | BigNumber;
type OptionalMethodInputs =
  | Array<MethodArg | MethodArg[] | undefined | null>
  | undefined;
interface ListenerOptions {
  // how often this data should be fetched, by default 1
  readonly blocksPerFetch?: number;
}

function useGetSingleCallResult<T>(
  contract: Contract | null | undefined,
  methodName: string,
  inputs: OptionalMethodInputs = [],
  options?: ListenerOptions // TODO unused
): () => Promise<T> {
  const getter = async () => await contract?.[methodName](...inputs);
  return getter;
}

export function useGetTokenAllowance(
  token?: Token,
  owner?: string | null,
  spender?: string
): () => Promise<TokenAmount | undefined> {
  const contract = useTokenContract(token?.address, false);

  const inputs = useMemo(() => [owner, spender], [owner, spender]);
  const getAllowance = useGetSingleCallResult<BigNumber>(
    contract,
    "allowance",
    inputs
  );

  const getTokenAllowance = async () => {
    const allowance = await getAllowance();
    if (!allowance) {
      return;
    }
    if (!token) {
      console.warn("No token specified in `getTokenAllowance`");
      return;
    }
    return new TokenAmount(token, allowance.toString());
  };

  return getTokenAllowance;
}

export function useGetTokenBalance(
  token: Token,
  owner?: string | null
): () => Promise<TokenAmount> {
  const contract = useTokenContract(token?.address, false);

  const inputs = useMemo(() => [owner], [owner]);
  const getBalance = useGetSingleCallResult<BigNumber>(
    contract,
    "balanceOf",
    inputs
  );

  const getTokenBalance = async () => {
    const zeroTokenAmount = new TokenAmount(token, "0");
    if (!owner) {
      return zeroTokenAmount;
    }
    const balance = await getBalance();
    if (!balance) {
      return zeroTokenAmount;
    }
    return new TokenAmount(token, balance.toString());
  };

  return getTokenBalance;
}

// Returns a list of timestamps of the latest deposits
export function useTornadoDeposits(tornadoAddress?: string) {
  const { library } = useWeb3React(NetworkContextName);
  const tornado = useMemo(() => {
    if (!tornadoAddress) {
      return;
    }
    return getContract(tornadoAddress, ERC20_TORNADO_ABI, library);
  }, [tornadoAddress, library]);
  const [deposits, setDeposits] = useState<any>([]);

  useEffect(() => {
    if (tornado && library) {
      const depositFilter = tornado.filters.Deposit();
      tornado.queryFilter(depositFilter, 0, "latest").then((events) => {
        const blockPromises = events.map(({ blockNumber }) => {
          return library.provider.kit.connection.getBlock(blockNumber);
        });
        Promise.all(blockPromises).then((blocks) => {
          setDeposits(blocks);
        });
      });
    }
  }, [tornado, library]);

  return deposits;
}
