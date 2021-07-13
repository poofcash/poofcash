import { useContractKit } from "@celo-tools/use-contractkit";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { useAsyncState } from "hooks/useAsyncState";
import React from "react";
import { AirdropReceipt } from "./AirdropReceipt";
import { DoAirdrop } from "./DoAirdrop";
import { fromWei } from "web3-utils";

enum AirdropStep {
  DO = "DO",
  RECEIPT = "RECEIPT",
}

const AirdropPage: React.FC = () => {
  const [step, setStep] = React.useState(AirdropStep.DO);
  const { address } = useContractKit();
  const { poofKit } = PoofKitGlobal.useContainer();
  const voucherBalanceCall = React.useCallback(async () => {
    if (!address) {
      return "0";
    }
    return await poofKit
      ?.voucherBalance(address)
      .then((v) => fromWei(v).toString());
  }, [poofKit, address]);
  const [redeemAmount] = useAsyncState("0", voucherBalanceCall);
  const [txHash, setTxHash] = React.useState("");

  switch (step) {
    case AirdropStep.DO:
      return (
        <DoAirdrop
          openReceiptPage={() => setStep(AirdropStep.RECEIPT)}
          redeemAmount={redeemAmount}
          setTxHash={setTxHash}
        />
      );
    case AirdropStep.RECEIPT:
      return (
        <AirdropReceipt
          onDoneClick={() => setStep(AirdropStep.DO)}
          redeemAmount={redeemAmount}
          txHash={txHash}
        />
      );
  }
};

export default AirdropPage;
