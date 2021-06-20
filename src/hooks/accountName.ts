import { useContractKit } from "@celo-tools/use-contractkit";

export const shortenAccount = (account: string) => {
  return (
    account.slice(0, 6) +
    ".." +
    account.slice(account.length - 5, account.length)
  );
};

export const useAccountName = () => {
  const { address } = useContractKit();
  return shortenAccount(address);
};
