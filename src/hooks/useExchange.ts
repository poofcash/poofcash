import React from "react";
import { useExchangeAllowance } from "./exchange/useExchangeAllowance";
import { useExchangeCall } from "hooks/exchange/useExchangeCall";
import { useExchangeRate } from "hooks/exchange/useExchangeRate";
import { useExchangeApprove } from "hooks/exchange/useExchangeApprove";
import { useExchangeMode } from "./exchange/useExchangeMode";

export const useExchange = () => {
  const [fromCurrency, setFromCurrency] = React.useState("CELO");
  const [toCurrency, setToCurrency] = React.useState("rCELO");
  const [fromAmount, setFromAmount] = React.useState("0");
  const [toAmount, setToAmount] = React.useState("0");
  const [txHash, setTxHash] = React.useState("");

  const [allowance, refetchAllowance] = useExchangeAllowance(
    fromCurrency,
    toCurrency
  );
  const exchangeCall = useExchangeCall(fromCurrency, toCurrency, fromAmount);
  const [exchangeRate] = useExchangeRate(
    fromCurrency,
    toCurrency,
    Number(fromAmount) === 0 ? "1" : fromAmount
  );
  const approveCall = useExchangeApprove(fromCurrency, toCurrency);
  const [exchangeMode] = useExchangeMode(fromCurrency, toCurrency);

  return {
    fromCurrency,
    setFromCurrency: (currency: string) => {
      if (currency === toCurrency) {
        const temp = fromCurrency;
        setFromCurrency(currency);
        setToCurrency(temp);
      } else {
        setFromCurrency(currency);
      }
    },
    fromAmount,
    setFromAmount: (amount: string) => {
      setFromAmount(amount);
      setToAmount((Number(amount) * Number(exchangeRate)).toString());
    },
    toCurrency,
    setToCurrency: (currency: string) => {
      if (currency === fromCurrency) {
        const temp = toCurrency;
        setToCurrency(currency);
        setFromCurrency(temp);
      } else {
        setToCurrency(currency);
      }
    },
    toAmount,
    setToAmount: (amount: string) => {
      setToAmount(amount);
      setFromAmount((Number(amount) / Number(exchangeRate)).toString());
    },
    exchangeRate,
    exchangeCall,
    allowance,
    txHash,
    setTxHash,
    approveCall: async () => {
      await approveCall();
      refetchAllowance();
    },
    exchangeMode,
  };
};
