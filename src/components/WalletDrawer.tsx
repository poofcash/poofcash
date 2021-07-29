import { atom, useRecoilState } from "recoil";
import { Wallet, X } from "phosphor-react";
import { Box, Button, Flex, Text, useColorMode } from "theme-ui";
import { useContractKit } from "@celo-tools/use-contractkit";
import { shortenAccount } from "hooks/accountName";
import { InfoDrawer } from "./InfoDrawer";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";

export const walletDrawerOpen = atom({
  key: "WALLET_DRAWER_OPEN",
  default: false,
});

export const WalletDrawer: React.FC = () => {
  const [colorMode] = useColorMode();
  const { address, connect, destroy } = useContractKit();
  const [isOpen, setIsOpen] = useRecoilState(walletDrawerOpen);

  if (!isOpen || !address) {
    return null;
  }

  return (
    <InfoDrawer>
      <Flex sx={{ justifyContent: "space-between", mb: 3 }}>
        <Text sx={{ fontSize: 18 }}>Wallet</Text>
        <X size={20} onClick={() => setIsOpen(false)} />
      </Flex>
      <Box
        sx={{
          backgroundColor:
            colorMode === "dark" ? "background" : "secondaryBackground",
          mb: 3,
          p: 2,
          borderRadius: 4,
        }}
      >
        <CopyToClipboard
          text={address}
          onCopy={() => toast("Copied walet address to clipboard")}
        >
          <Flex sx={{ alignItems: "center" }}>
            <Wallet size={32} />
            <Text variant="primary" mt={2} ml={2}>
              {shortenAccount(address, 12)}
            </Text>
          </Flex>
        </CopyToClipboard>
      </Box>
      <Flex sx={{ justifyContent: "center" }}>
        <Button
          variant="secondary"
          mr={2}
          onClick={() => connect().catch(console.warn)}
        >
          Change Wallet
        </Button>
        <Button onClick={destroy}>Disconnect</Button>
      </Flex>
    </InfoDrawer>
  );
};
