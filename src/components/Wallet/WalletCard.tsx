import { Card, Flex, Text } from "theme-ui";
import { Wallet } from "phosphor-react";
import { shortenAccount } from "hooks/accountName";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useRecoilState } from "recoil";
import { walletDrawerOpen } from "components/Wallet/WalletDrawer";
import { poofAccountDrawerOpen } from "components/PoofAccount/PoofAccountDrawer";

export const WalletCard: React.FC = () => {
  const { address, connect } = useContractKit();
  const [, setAccountDrawerIsOpen] = useRecoilState(poofAccountDrawerOpen);
  const [walletDrawerIsOpen, setWalletDrawerIsOpen] = useRecoilState(
    walletDrawerOpen
  );

  return (
    <Card
      variant="warning"
      onClick={() => {
        if (!address) {
          connect().then(console.warn);
          return;
        }
        if (!walletDrawerIsOpen) {
          setAccountDrawerIsOpen(false);
        }
        setWalletDrawerIsOpen(!walletDrawerIsOpen);
      }}
    >
      <Flex sx={{ alignItems: "center" }}>
        <Wallet size={32} />
        <Text variant="primary" ml={2} mt={1}>
          {address ? shortenAccount(address) : "Connect Wallet"}
        </Text>
      </Flex>
    </Card>
  );
};
