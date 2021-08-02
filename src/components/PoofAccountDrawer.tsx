import { atom, useRecoilState } from "recoil";
import { InfoDrawer } from "./InfoDrawer";
import { PoofAccountDetails } from "./PoofAccountDetails";

export const poofAccountDrawerOpen = atom({
  key: "POOF_ACCOUNT_DRAWER_OPEN",
  default: false,
});

export const PoofAccountDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useRecoilState(poofAccountDrawerOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <InfoDrawer>
      <PoofAccountDetails onClose={() => setIsOpen(false)} />
    </InfoDrawer>
  );
};
