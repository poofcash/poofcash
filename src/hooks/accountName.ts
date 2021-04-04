import { useWeb3React } from "@web3-react/core";
import { valora } from "connectors";

export const useAccountName = () => {
  const { account } = useWeb3React();
  if (valora.valoraAccount?.phoneNumber) {
    return valora.valoraAccount.phoneNumber;
  } else if (account) {
    return (
      account.slice(0, 6) +
      "..." +
      account.slice(account.length - 5, account.length - 1)
    );
  }
  return account;
};
