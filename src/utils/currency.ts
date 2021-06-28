import { supportedCurrencies } from "config";

export const formatCurrency = (v: string) => {
  const match = supportedCurrencies.find(
    (supported) => supported.toLowerCase() === v.toLowerCase()
  );
  if (!match) {
    return v;
  }
  return match;
};
