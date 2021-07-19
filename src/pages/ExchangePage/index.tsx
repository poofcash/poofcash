import { useContractKit } from "@celo-tools/use-contractkit";
import { useAsyncState } from "hooks/useAsyncState";
import React from "react";
import { ExchangeReceipt } from "./ExchangeReceipt";
import { DoExchange } from "./DoExchange";
import { CURRENCY_MAP } from "config";
import erc20Abi from "abis/ERC20.json";
import { AbiItem, isAddress } from "web3-utils";
import { useExchange } from "hooks/useExchange";

enum ExchangeStep {
  DO = "DO",
  RECEIPT = "RECEIPT",
}

const ExchangePage: React.FC = () => {
  const [step, setStep] = React.useState(ExchangeStep.DO);
  const { kit, address, network } = useContractKit();
  const [currencies, setCurrencies] = React.useState({
    from: "CELO",
    to: "rCELO",
  });

  const fromBalanceCall = React.useCallback(async () => {
    const fromToken = new kit.web3.eth.Contract(
      erc20Abi as AbiItem[],
      CURRENCY_MAP[network.chainId][currencies.from.toLowerCase()]
    );
    if (!address || !isAddress(address)) {
      return ["0", "0"];
    }
    let spender = CURRENCY_MAP[network.chainId].rcelo;
    // TODO spender
    return await Promise.all([
      fromToken.methods.balanceOf(address).call(),
      fromToken.methods.allowance(address, spender).call(),
    ]);
  }, [kit, address, network]);

  const [[fromBalance, fromAllowance], refetchFromBalance] = useAsyncState(
    ["0", "0"],
    fromBalanceCall
  );

  const [txHash, setTxHash] = React.useState("");

  const {
    fromCurrency,
    setFromCurrency,
    fromAmount,
    setFromAmount,
    toCurrency,
    setToCurrency,
    toAmount,
    setToAmount,
    exchangeRate,
  } = useExchange();

  switch (step) {
    case ExchangeStep.DO:
      return (
        <DoExchange
          openReceiptPage={() => setStep(ExchangeStep.RECEIPT)}
          setTxHash={setTxHash}
          fromCurrency={fromCurrency}
          setFromCurrency={setFromCurrency}
          toCurrency={toCurrency}
          setToCurrency={setToCurrency}
          fromAmount={fromAmount}
          setFromAmount={setFromAmount}
          toAmount={toAmount}
          setToAmount={setToAmount}
          exchangeRate={exchangeRate}
          fromBalance={fromBalance}
          fromAllowance={fromAllowance}
          refetch={() => {
            refetchFromBalance();
          }}
        />
      );
    case ExchangeStep.RECEIPT:
      return (
        <ExchangeReceipt
          onDoneClick={() => setStep(ExchangeStep.DO)}
          amount={fromAmount}
          currencies={currencies}
          txHash={txHash}
        />
      );
  }
};

export default ExchangePage;
