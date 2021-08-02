import React from "react";
import { useAsyncState } from "hooks/useAsyncState";

export enum ExchangeMode {
  UBESWAP = "UBESWAP",
  DIRECT = "DIRECT",
}

export const useExchangeMode = (fromCurrency: string, toCurrency: string) => {
  const call = React.useCallback(async () => {
    if (fromCurrency.toLowerCase() === "celo") {
      if (toCurrency.toLowerCase() === "rcelo") {
        return ExchangeMode.UBESWAP;
      } else {
        return ExchangeMode.DIRECT;
      }
    } else if (fromCurrency.toLowerCase() === "rcelo") {
      if (toCurrency.toLowerCase() === "celo") {
        return ExchangeMode.UBESWAP;
      } else {
        // FUTURE: Ubeswap
        return ExchangeMode.DIRECT;
      }
    } else {
      if (toCurrency.toLowerCase() === "celo") {
        return ExchangeMode.UBESWAP;
      } else {
        return ExchangeMode.DIRECT;
      }
    }
  }, [fromCurrency, toCurrency]);

  return useAsyncState(ExchangeMode.UBESWAP, call);
};
