import React from "react";
import { ContractKit } from "@celo/contractkit";
import { MaxUint256 } from "@ethersproject/constants";
import { useContractKit } from "@celo-tools/use-contractkit";
import { toWei, toBN } from "web3-utils";
import BN from "bn.js";
import { PoofKitV2 } from "@poofcash/poof-kit";
import { Address } from "@celo/base";

export enum ApprovalState {
  UNKNOWN = "UNKNOWN",
  NOT_APPROVED = "NOT_APPROVED",
  PENDING = "PENDING",
  WAITING_CONFIRMATIONS = "WAITING_CONFIRMATIONS",
  APPROVED = "APPROVED",
}

export enum DepositState {
  UNKNOWN = "UNKNOWN",
  PENDING = "PENDING",
  DONE = "DONE",
}

export function useApproveCallback(
  tokenAddress: Address,
  amountToApprove: BN
): [ApprovalState, () => Promise<void>] {
  const { address, performActions } = useContractKit();
  const { kit } = useContractKit();
  const [approvalState, setApprovalState] = React.useState(
    ApprovalState.UNKNOWN
  );
  const [allowance, setAllowance] = React.useState<BN | undefined>();

  // TODO, this is kind of fragile
  React.useEffect(() => {
    if (address && amountToApprove.gt(toBN(0))) {
      const asyncSetCurrentAllowance = async () => {
        try {
          const poofKit = new PoofKitV2(kit);
          const currentAllowance = toBN(
            await poofKit.allowance(tokenAddress, address)
          );
          setAllowance(currentAllowance);
        } catch (e) {
          console.error(e);
        }
      };
      asyncSetCurrentAllowance();
    }
  }, [address, approvalState, amountToApprove, kit, tokenAddress]);

  // check the current approval status
  // This keeps getting called. One of the deps is unstable.
  React.useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      return;
    }
    if (allowance && amountToApprove) {
      if (allowance.lt(amountToApprove)) {
        setApprovalState(ApprovalState.NOT_APPROVED);
      } else {
        setApprovalState(ApprovalState.APPROVED);
      }
    }
  }, [approvalState, amountToApprove, allowance]);

  const approve = React.useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error("approve was called unnecessarily");
      return;
    }

    if (!amountToApprove) {
      console.error("missing amount to approve");
      return;
    }

    setApprovalState(ApprovalState.PENDING);
    const useExact = true;

    try {
      await performActions(async (kit: ContractKit) => {
        const poofKit = new PoofKitV2(kit);
        const approveTxo = poofKit.approve(
          tokenAddress,
          useExact ? amountToApprove.toString() : MaxUint256.toString()
        );
        const tx = await kit.sendTransactionObject(approveTxo, {
          from: address,
          gasPrice: toWei("0.1", "gwei"),
        });
        await tx.waitReceipt();
        setApprovalState(ApprovalState.APPROVED);
        setAllowance(toBN(MaxUint256.toString()));
      });
    } catch (error) {
      console.debug("Failed to approve", error);
      alert(error.message);
      setApprovalState(ApprovalState.NOT_APPROVED);
    }
  }, [approvalState, tokenAddress, amountToApprove, performActions, address]);

  return [approvalState, approve];
}

export function useDepositCallback(
  noteString: string
): [DepositState, string, () => Promise<void>] {
  const [depositState, setDepositState] = React.useState(DepositState.UNKNOWN);
  const [txHash, setTxHash] = React.useState("");
  const { performActions, address } = useContractKit();

  // Reset deposit state when there is a new commitment
  React.useEffect(() => setDepositState(DepositState.UNKNOWN), [noteString]);

  const deposit = React.useCallback(async (): Promise<void> => {
    setDepositState(DepositState.PENDING);
    try {
      await performActions(async (kit) => {
        const poofKit = new PoofKitV2(kit);
        const depositTxo = poofKit.depositNote(noteString);
        const tx = await kit.sendTransactionObject(depositTxo, {
          from: address,
          gasPrice: toWei("0.1", "gwei"),
        });
        setTxHash(await tx.getHash());
      });
    } catch (error) {
      setDepositState(DepositState.UNKNOWN);
      console.error("Failed to deposit", error);
      alert(
        `${error.toString()}. Sometimes this can happen if you don't have enough CELO and/or cUSD to pay for gas.`
      );
    }
    setDepositState(DepositState.DONE);
  }, [performActions, noteString, address]);

  return [depositState, txHash, deposit];
}
