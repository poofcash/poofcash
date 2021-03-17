import { useMemo, useState, useEffect } from "react";
import { Token, TokenAmount } from "@ubeswap/sdk";
import { useTokenContract } from "hooks/getContract";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";

type MethodArg = string | number | BigNumber;
type OptionalMethodInputs =
  | Array<MethodArg | MethodArg[] | undefined | null>
  | undefined;
interface ListenerOptions {
  // how often this data should be fetched, by default 1
  readonly blocksPerFetch?: number;
}

function useSingleCallResult<T>(
  contract: Contract | null | undefined,
  methodName: string,
  inputs?: OptionalMethodInputs,
  options?: ListenerOptions // TODO unused
): T | undefined {
  const [result, setResult] = useState<T>();

  useEffect(() => {
    if (inputs) {
      contract?.[methodName](...inputs)
        .then(setResult)
        .catch(console.error);
    } else {
      contract?.[methodName]().then(setResult).catch(console.error);
    }
  }, [contract, methodName, inputs]);

  return result;
}

export function useTokenAllowance(
  token?: Token,
  owner?: string | null,
  spender?: string
): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false);

  const inputs = useMemo(() => [owner, spender], [owner, spender]);
  const allowance = useSingleCallResult<BigNumber>(
    contract,
    "allowance",
    inputs
  );

  return token && allowance
    ? new TokenAmount(token, allowance.toString())
    : undefined;
}
