import { Wallet, X } from "phosphor-react";
import { Box, Button, Flex, Text, useColorMode } from "theme-ui";
import { useContractKit } from "@celo-tools/use-contractkit";
import { shortenAccount } from "hooks/accountName";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";

interface Props {
  onClose?: () => any;
}

export const WalletDetails: React.FC<Props> = ({ onClose }) => {
  const [colorMode] = useColorMode();
  const { address, connect, destroy } = useContractKit();

  return (
    <Box>
      <Flex sx={{ justifyContent: "space-between", mb: 3 }}>
        <Text sx={{ fontSize: 18 }}>Wallet</Text>
        {onClose && <X size={20} onClick={onClose} />}
      </Flex>
      {address && (
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
            onCopy={() => toast("Copied wallet address to clipboard")}
          >
            <Flex sx={{ alignItems: "center" }}>
              <Wallet size={32} />
              <Text variant="primary" mt={2} ml={2}>
                {shortenAccount(address, 12)}
              </Text>
            </Flex>
          </CopyToClipboard>
        </Box>
      )}
      <Flex sx={{ justifyContent: "center" }}>
        <Button
          sx={{ whiteSpace: "nowrap" }}
          variant="secondary"
          mr={2}
          onClick={() => connect().catch(console.warn)}
        >
          Change Wallet
        </Button>
        <Button sx={{ whiteSpace: "nowrap" }} onClick={destroy}>
          Disconnect
        </Button>
      </Flex>
    </Box>
  );
};
