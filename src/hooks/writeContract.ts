import React from "react";
import { ContractKit } from "@celo/contractkit";
import { MaxUint256 } from "@ethersproject/constants";
import { useContractKit } from "@ubeswap/use-contractkit";
import { toWei } from "web3-utils";
import { PoofKitV2 } from "@poofcash/poof-kit";
import { Address } from "@celo/base";
import { CHAIN_ID } from "config";
import { PoofKitGlobal } from "./usePoofKit";
import { useAsyncState } from "./useAsyncState";

export function useApprove(
  tokenAddress: Address,
  amountToApprove: string
): [string, () => Promise<void>, boolean] {
  const { address, performActions } = useContractKit();
  const { poofKit } = PoofKitGlobal.useContainer();
  const [loading, setLoading] = React.useState(false);

  const allowanceCall = React.useCallback(async () => {
    if (!address || !tokenAddress) {
      return "0";
    }
    return await poofKit.allowance(tokenAddress, address);
  }, [poofKit, address, tokenAddress]);
  const [allowance, refetchAllowance] = useAsyncState("0", allowanceCall);

  const approve = React.useCallback(async (): Promise<void> => {
    const useExact = false;
    setLoading(true);
    try {
      await performActions(async (kit: ContractKit) => {
        const poofKit = new PoofKitV2(kit, CHAIN_ID);
        const approveTxo = poofKit.approve(
          tokenAddress,
          useExact ? amountToApprove : MaxUint256.toString()
        );
        const tx = await kit.sendTransactionObject(approveTxo, {
          from: kit.defaultAccount,
          gasPrice: toWei("0.1", "gwei"),
        });
        await tx.waitReceipt();
        refetchAllowance();
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [tokenAddress, amountToApprove, performActions, refetchAllowance]);

  return [allowance, approve, loading];
}

export function useDeposit(
  noteString: string
): [string, (privateKey?: string) => Promise<void>, boolean] {
  const [loading, setLoading] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");
  const { getConnectedKit } = useContractKit();

  const deposit = React.useCallback(
    async (privateKey?: string) => {
      setLoading(true);
      try {
        const kit = await getConnectedKit();
        const poofKit = new PoofKitV2(kit, CHAIN_ID);
        let depositTxo = poofKit.depositNote(noteString, privateKey);
        await kit
          .sendTransactionObject(depositTxo, {
            from: kit.defaultAccount,
            gasPrice: toWei("0.13", "gwei"),
            value: 0,
          })
          .then((tx) => tx.getHash())
          .then(setTxHash);
      } catch (e) {
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [getConnectedKit, noteString]
  );

  return [txHash, deposit, loading];
}
