import { atom, useRecoilState } from "recoil";
import { InfoDrawer } from "components/InfoDrawer";
import { WalletDetails } from "components/Wallet/WalletDetails";

export const walletDrawerOpen = atom({
  key: "WALLET_DRAWER_OPEN",
  default: false,
});

export const WalletDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useRecoilState(walletDrawerOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <InfoDrawer>
      <WalletDetails onClose={() => setIsOpen(false)} />
    </InfoDrawer>
  );
};
