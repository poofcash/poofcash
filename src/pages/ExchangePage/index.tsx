import { useContractKit } from "@ubeswap/use-contractkit";
import { useAsyncState } from "hooks/useAsyncState";
import React from "react";
import { ExchangeReceipt } from "./ExchangeReceipt";
import { DoExchange } from "./DoExchange";
import { CURRENCY_MAP } from "config";
import erc20Abi from "abis/ERC20.json";
import { AbiItem, isAddress } from "web3-utils";

enum ExchangeStep {
  DO = "DO",
  RECEIPT = "RECEIPT",
}

const ExchangePage: React.FC = () => {
  const [step, setStep] = React.useState(ExchangeStep.DO);
  const { kit, address } = useContractKit();
  const sCELOBalanceCall = React.useCallback(async () => {
    const savingsCELO = new kit.web3.eth.Contract(
      erc20Abi as AbiItem[],
      CURRENCY_MAP.scelo
    );
    if (!address || !isAddress(address)) {
      return ["0", "0"];
    }
    return await Promise.all([
      savingsCELO.methods.balanceOf(address).call(),
      savingsCELO.methods.allowance(address, CURRENCY_MAP.rcelo).call(),
    ]);
  }, [kit, address]);
  const rCELOBalanceCall = React.useCallback(async () => {
    const rewardsCELO = new kit.web3.eth.Contract(
      erc20Abi as AbiItem[],
      CURRENCY_MAP.rcelo
    );
    if (!address || !isAddress(address)) {
      return ["0", "0"];
    }
    return await Promise.all([
      rewardsCELO.methods.balanceOf(address).call(),
      rewardsCELO.methods.allowance(address, CURRENCY_MAP.rcelo).call(),
    ]);
  }, [kit, address]);

  const [[sCELOBalance, sCELOAllowance], refetchSCELO] = useAsyncState(
    ["0", "0"],
    sCELOBalanceCall
  );
  const [[rCELOBalance], refetchRCELO] = useAsyncState(
    ["0", "0"],
    rCELOBalanceCall
  );
  const [currencies, setCurrencies] = React.useState({
    from: "sCELO",
    to: "rCELO",
  });
  const [amount, setAmount] = React.useState("0");
  const [txHash, setTxHash] = React.useState("");

  switch (step) {
    case ExchangeStep.DO:
      return (
        <DoExchange
          openReceiptPage={() => setStep(ExchangeStep.RECEIPT)}
          setTxHash={setTxHash}
          currencies={currencies}
          switchCurrencies={() => {
            setCurrencies({
              to: currencies.from,
              from: currencies.to,
            });
          }}
          amount={amount}
          setAmount={setAmount}
          sCELOBalance={sCELOBalance}
          rCELOBalance={rCELOBalance}
          sCELOAllowance={sCELOAllowance}
          refetch={() => {
            refetchSCELO();
            refetchRCELO();
          }}
        />
      );
    case ExchangeStep.RECEIPT:
      return (
        <ExchangeReceipt
          onDoneClick={() => setStep(ExchangeStep.DO)}
          amount={amount}
          currencies={currencies}
          txHash={txHash}
        />
      );
  }
};

export default ExchangePage;
