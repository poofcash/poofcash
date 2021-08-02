import { Moon, Sun, UserCircle, X } from "phosphor-react";
import { Box, Button, Flex, Text, useColorMode } from "theme-ui";
import { shortenAccount } from "hooks/accountName";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { Page } from "state/global";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { useHistory } from "react-router-dom";

interface Props {
  onClose?: () => any;
}

export const PoofAccountDetails: React.FC<Props> = ({ onClose }) => {
  const {
    poofAccount,
    disconnectPoofAccount,
  } = PoofAccountGlobal.useContainer();
  const [colorMode, setColorMode] = useColorMode();
  const history = useHistory();

  return (
    <>
      <Flex sx={{ justifyContent: "space-between", mb: 3 }}>
        <Text sx={{ fontSize: 18 }}>Poof Account</Text>
        {onClose && <X size={20} onClick={onClose} />}
      </Flex>
      {poofAccount && (
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
            text={`0x${poofAccount.address}`}
            onCopy={() => toast("Copied Poof Account to clipboard")}
          >
            <Flex sx={{ alignItems: "center" }}>
              <UserCircle size={32} />
              <Text variant="primary" mt={2} ml={2}>
                {shortenAccount(`0x${poofAccount.address}`, 12)}
              </Text>
            </Flex>
          </CopyToClipboard>
        </Box>
      )}
      <Flex sx={{ justifyContent: "center" }}>
        <Button
          variant="secondary"
          mr={2}
          onClick={() => {
            setColorMode(colorMode === "dark" ? "default" : "dark");
          }}
        >
          <Flex sx={{ alignItems: "center" }}>
            {colorMode === "dark" ? <Moon size={24} /> : <Sun size={24} />}
            <Text color="primary" ml={3} mt="2px">
              {colorMode === "dark" ? "Dark" : "Light"} Mode
            </Text>
          </Flex>
        </Button>
        {poofAccount ? (
          <Button onClick={disconnectPoofAccount}>Log out</Button>
        ) : (
          <Button
            onClick={() => {
              history.push(`/${Page.SETUP}`);
            }}
          >
            Log in
          </Button>
        )}
      </Flex>
    </>
  );
};
