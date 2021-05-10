import React from "react";
import { TokenAmount } from "@ubeswap/sdk";
import { useGetTokenAllowance } from "./readContract";
import { getTokenContract, getTornadoContract } from "./getContract";
import { MaxUint256 } from "@ethersproject/constants";
import { CHAIN_ID } from "config";
import { instances } from "@poofcash/poof-token";
import { useContractKit } from "@celo-tools/use-contractkit";
import { toWei } from "web3-utils";

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
  amountToApprove: TokenAmount,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { address, performActions } = useContractKit();
  const token = amountToApprove.token;
  const getCurrentAllowance = useGetTokenAllowance(token, address, spender);
  const [approvalState, setApprovalState] = React.useState(
    ApprovalState.UNKNOWN
  );
  const [allowance, setAllowance] = React.useState<TokenAmount | undefined>();

  // TODO, this is kind of fragile
  React.useEffect(() => {
    if (address && Number(amountToApprove.toExact()) > 0) {
      const asyncSetCurrentAllowance = async () => {
        try {
          const currentAllowance = await getCurrentAllowance();
          setAllowance(currentAllowance);
        } catch (e) {
          console.error(e);
        }
      };
      asyncSetCurrentAllowance();
    }
  }, [address, approvalState, getCurrentAllowance, amountToApprove]);

  // check the current approval status
  React.useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      return;
    }
    if (allowance && amountToApprove) {
      if (allowance.lessThan(amountToApprove)) {
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

    if (!token) {
      console.error("no token");
      return;
    }

    if (!amountToApprove) {
      console.error("missing amount to approve");
      return;
    }

    if (!spender) {
      console.error("no spender");
      return;
    }

    setApprovalState(ApprovalState.PENDING);
    const useExact = false;
    // const estimatedGas = await tokenContract.estimateGas
    //   .approve(spender, MaxUint256)
    //   .catch(() => {
    //     // general fallback for tokens who restrict approval amounts return tokenContract.estimateGas.approve(
    //       spender,
    //       amountToApprove.raw.toString()
    //     );
    //   });

    try {
      await performActions(async (kit) => {
        const tokenContract = getTokenContract(kit, token.address);
        await tokenContract.methods
          .approve(
            spender,
            useExact ? amountToApprove.raw.toString() : MaxUint256
            //    {
            //      gasLimit: calculateGasMargin(estimatedGas),
            //    }
          )
          .send({
            from: kit.defaultAccount,
            gasLimit: 2000000,
            gasPrice: toWei("0.13", "gwei"),
          });
      });
      setApprovalState(ApprovalState.APPROVED);
    } catch (error) {
      console.debug("Failed to approve", error);
      alert(error.message);
      setApprovalState(ApprovalState.NOT_APPROVED);
    }
  }, [approvalState, token, amountToApprove, spender, performActions]);

  return [approvalState, approve];
}

export function useDepositCallback(
  amountToDeposit: number,
  commitment: string
): [DepositState, string, () => Promise<void>] {
  const [depositState, setDepositState] = React.useState(DepositState.UNKNOWN);
  const [txHash, setTxHash] = React.useState("");
  const { performActions, address } = useContractKit();

  // Reset deposit state when there is a new commitment
  React.useEffect(() => setDepositState(DepositState.UNKNOWN), [commitment]);

  const deposit = React.useCallback(async (): Promise<void> => {
    setDepositState(DepositState.PENDING);
    try {
      await performActions(async (kit) => {
        const tornadoContract = getTornadoContract(
          kit,
          instances[`netId${CHAIN_ID}`]["celo"].instanceAddress[amountToDeposit]
        );
        console.log(address);
        const tx = await tornadoContract.methods.deposit(commitment, []).send({
          from: address,
          gasLimit: 2000000,
          gasPrice: toWei("0.13", "gwei"),
        });
        setTxHash(tx.transactionHash);
      });
    } catch (error) {
      setDepositState(DepositState.UNKNOWN);
      console.error("Failed to deposit", error);
      alert(
        `${error.toString()}. Sometimes this can happen if you don't have enough CELO and/or cUSD to pay for gas.`
      );
    }
    setDepositState(DepositState.DONE);
  }, [performActions, amountToDeposit, address, commitment]);

  return [depositState, txHash, deposit];
}
