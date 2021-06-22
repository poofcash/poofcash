import { useEffect, useMemo, useState } from "react";
import { Token, TokenAmount } from "@ubeswap/sdk";
import { getContract, getTokenContract } from "hooks/getContract";
import ERC20_TORNADO_ABI from "abis/erc20tornado.json";
import { useContractKit } from "@celo-tools/use-contractkit";

export function useGetTokenBalance(
  token: Token,
  owner?: string | null
): () => Promise<TokenAmount> {
  const { kit } = useContractKit();
  const erc20 = getTokenContract(kit, token?.address);

  const getTokenBalance = async () => {
    const zeroTokenAmount = new TokenAmount(token, "0");
    if (!owner) {
      return zeroTokenAmount;
    }
    if (!erc20) {
      console.warn("ERC20 contract is null");
      return zeroTokenAmount;
    }
    const balance = await erc20.methods.balanceOf(owner).call();
    if (!balance) {
      return zeroTokenAmount;
    }
    return new TokenAmount(token, balance.toString());
  };

  return getTokenBalance;
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
