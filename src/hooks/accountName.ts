import { useWeb3React } from "@web3-react/core";
import { valora } from "connectors";

export const shortenAccount = (account: string) => {
  return (
    account.slice(0, 6) +
    ".." +
    account.slice(account.length - 5, account.length)
  );
};

export const useAccountName = () => {
  const { account } = useWeb3React();
  if (valora.valoraAccount?.phoneNumber) {
    return valora.valoraAccount.phoneNumber;
  } else if (account) {
    return shortenAccount(account);
  }
  return account;
};
