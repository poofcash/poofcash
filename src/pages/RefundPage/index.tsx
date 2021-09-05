import { useContractKit } from "@celo-tools/use-contractkit";
import { useAsyncState } from "hooks/useAsyncState";
import React from "react";
import { DoRefund } from "./DoRefund";
import { AbiItem, fromWei } from "web3-utils";
import RefundMetadata from "abis/Refund.json";
import { REFUND_CONTRACT } from "config";
import { Refund } from "generated/Refund";

const RefundPage: React.FC = () => {
  const { address, kit } = useContractKit();
  const call = React.useCallback(async () => {
    if (!address) {
      return "0";
    }
    const refund = (new kit.web3.eth.Contract(
      RefundMetadata.abi as AbiItem[],
      REFUND_CONTRACT
    ) as unknown) as Refund;
    return fromWei(await refund.methods.refundAmount(address).call());
  }, [kit, address]);
  const [refundAmount] = useAsyncState("0", call);

  return <DoRefund refundAmount={refundAmount} />;
};

export default RefundPage;
