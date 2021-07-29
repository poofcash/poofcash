import { atom, useRecoilState } from "recoil";
import { UserCircle, X } from "phosphor-react";
import { Box, Button, Flex, Text, useColorMode } from "theme-ui";
import { shortenAccount } from "hooks/accountName";
import { InfoDrawer } from "./InfoDrawer";
import { PoofAccountGlobal } from "hooks/poofAccount";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Page } from "state/global";

export const poofAccountDrawerOpen = atom({
  key: "POOF_ACCOUNT_DRAWER_OPEN",
  default: false,
});

export const PoofAccountDrawer: React.FC = () => {
  const {
    poofAccount,
    disconnectPoofAccount,
  } = PoofAccountGlobal.useContainer();
  const [isOpen, setIsOpen] = useRecoilState(poofAccountDrawerOpen);
  const [colorMode, setColorMode] = useColorMode();
  const history = useHistory();

  if (!isOpen) {
    return null;
  }

  return (
    <InfoDrawer>
      <Flex sx={{ justifyContent: "space-between", mb: 3 }}>
        <Text sx={{ fontSize: 18 }}>Poof Account</Text>
        <X size={20} onClick={() => setIsOpen(false)} />
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
          {colorMode === "dark" ? "Dark" : "Light"} Mode
        </Button>
        {poofAccount ? (
          <Button onClick={disconnectPoofAccount}>Log out</Button>
        ) : (
          <Button
            onClick={() => {
              setIsOpen(false);
              history.push(`/${Page.SETUP}`);
            }}
          >
            Log in
          </Button>
        )}
      </Flex>
    </InfoDrawer>
  );
};
