import { DECIMAL_PRECISION } from "config";

export const humanFriendlyNumber = (v: number | string) => {
  const num = Number(v);
  if (num === 0) {
    return "0";
  }
  const smallest = Math.pow(10, -DECIMAL_PRECISION);
  if (num < smallest) {
    return `<${smallest.toFixed(DECIMAL_PRECISION)}`;
  }

  const formatted = num.toLocaleString(undefined, {
    minimumFractionDigits: 20,
  });
  const decimalIdx = formatted.indexOf(".") !== -1 ? formatted.indexOf(".") : formatted.indexOf(',')
  if (decimalIdx === -1) {
    return formatted;
  }
  return formatted.slice(0, decimalIdx + 1 + DECIMAL_PRECISION);
};
