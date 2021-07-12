import { useCallback, useEffect, useMemo, useState } from "react";
import { getContract } from "hooks/getContract";
import ERC20_ABI from "abis/ERC20.json";
import ERC20_TORNADO_ABI from "abis/ERC20Tornado.json";
import { useContractKit } from "@ubeswap/use-contractkit";
import { AbiItem, isAddress } from "web3-utils";
import { useAsyncState } from "./useAsyncState";

export function useTokenBalance(tokenAddress: string, owner?: string | null) {
  const { kit } = useContractKit();
  const tokenContract = useMemo(() => {
    return new kit.web3.eth.Contract(
      (ERC20_ABI as unknown) as AbiItem,
      tokenAddress
    );
  }, [tokenAddress, kit]);

  const balanceCall = useCallback(async () => {
    if (!owner || !isAddress(owner)) {
      return "0";
    }
    return tokenContract.methods.balanceOf(owner).call();
  }, [owner, tokenContract]);

  const [balance] = useAsyncState("0", balanceCall);

  return balance;
}

// Returns a list of the latest deposits
export function useTornadoDeposits(
  tornadoAddress?: string,
  commitment?: string
) {
  const { kit } = useContractKit();
  const tornado = useMemo(() => {
    if (!tornadoAddress) {
      return null;
    }
    return getContract(kit, ERC20_TORNADO_ABI, tornadoAddress);
  }, [tornadoAddress, kit]);
  const [deposits, setDeposits] = useState<any>([]);

  useEffect(() => {
    if (tornado && kit) {
      tornado
        .getPastEvents("Deposit", {
          fromBlock: 0,
          toBlock: "latest",
          filter: commitment ? { commitment } : {},
        })
        .then((events) => {
          const blockPromises = events.map(({ blockNumber }) => {
            return kit.connection.getBlock(blockNumber);
          });
          Promise.all(blockPromises).then((blocks) => {
            setDeposits(blocks);
          });
        });
    }
  }, [tornado, kit, commitment]);

  return deposits;
}

// Returns a list of the latest withrdaws
export function useTornadoWithdraws(
  tornadoAddress?: string,
  nullifierHash?: string
) {
  const { kit } = useContractKit();
  const tornado = useMemo(() => {
    if (!tornadoAddress) {
      return;
    }
    return getContract(kit, ERC20_TORNADO_ABI, tornadoAddress);
  }, [tornadoAddress, kit]);
  const [withdrawBlocks, setWithdrawBlocks] = useState<any>([]);
  const [withdrawEvents, setWithdrawEvents] = useState<any>([]);

  useEffect(() => {
    if (tornado && kit) {
      tornado
        .getPastEvents("Withdrawal", {
          fromBlock: 0,
          toBlock: "latest",
        })
        .then((events) => {
          const filteredEvents = events.filter((event: any) => {
            if (!nullifierHash) {
              return true;
            }
            return event.args[1] === nullifierHash;
          });
          setWithdrawEvents(filteredEvents);
          const blockPromises = filteredEvents.map(({ blockNumber }) => {
            return kit.connection.getBlock(blockNumber);
          });
          Promise.all(blockPromises).then((blocks) => {
            setWithdrawBlocks(blocks);
          });
        });
    }
  }, [tornado, kit, nullifierHash]);

  return [withdrawBlocks, withdrawEvents];
}
