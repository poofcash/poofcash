import React from "react";
import { ContractKit } from "@celo/contractkit";
import { useContractKit } from "@ubeswap/use-contractkit";
import { toWei } from "web3-utils";
import { PoofKitV2 } from "@poofcash/poof-kit";
import { CHAIN_ID } from "config";
import { PoofKitGlobal } from "./poofUtils";
import { useAsyncState } from "./useAsyncState";

export function useApprove(
  currency: string,
  amount: string
): [string, () => Promise<void>, boolean] {
  const { address, performActions } = useContractKit();
  const { poofKit } = PoofKitGlobal.useContainer();
  const [loading, setLoading] = React.useState(false);

  const allowanceCall = React.useCallback(async () => {
    if (!address) {
      return "0";
    }
    return await poofKit.allowance(CHAIN_ID, currency, amount, address);
  }, [poofKit, address, currency, amount]);
  const [allowance, refetchAllowance] = useAsyncState("0", allowanceCall);

  const approve = React.useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await performActions(async (kit: ContractKit) => {
        const poofKit = new PoofKitV2(kit, CHAIN_ID);
        const approveTxo = poofKit.approve(
          CHAIN_ID,
          currency,
          amount
          // TODO: useExact ? amount : MaxUint256.toString()
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
  }, [currency, amount, performActions, refetchAllowance]);

  return [allowance, approve, loading];
}

export function useDeposit(
  noteString: string
): [string, () => Promise<void>, boolean] {
  const [loading, setLoading] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");
  const { getConnectedKit } = useContractKit();

  const deposit = React.useCallback(async () => {
    setLoading(true);
    try {
      const kit = await getConnectedKit();
      const poofKit = new PoofKitV2(kit, CHAIN_ID);
      const depositTxo = poofKit.depositNote(noteString);
      await kit
        .sendTransactionObject(depositTxo, {
          from: kit.defaultAccount,
          gasPrice: toWei("0.1", "gwei"),
        })
        .then((tx) => tx.getHash())
        .then(setTxHash);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  }, [getConnectedKit, noteString]);

  return [txHash, deposit, loading];
}
