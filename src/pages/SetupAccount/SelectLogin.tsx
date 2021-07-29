import React from "react";
import {
  Box,
  Button,
  Flex,
  useColorMode,
  Text,
  Heading,
  Input,
} from "theme-ui";
import { Page } from "state/global";
import { RouterLink } from "components/RouterLink";
import { Moon, Sun } from "phosphor-react";
import { FullLogo } from "components/FullLogo";
import { isPrivateKey } from "utils/eth";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { DividerWithText } from "components/DividerWithText";

interface IProps {
  goCreate: () => void;
}

export const SelectLogin: React.FC<IProps> = ({ goCreate }) => {
  const [colorMode, setColorMode] = useColorMode();
  const [privateKey, setPrivateKey] = React.useState("");
  const { savePoofAccount } = PoofAccountGlobal.useContainer();
  const history = useHistory();

  return (
    <>
      <Flex sx={{ justifyContent: "space-between", width: "100%", mb: "25%" }}>
        <FullLogo />
        <Button
          sx={{
            width: "36px",
            height: "36px",
            backgroundColor: "secondaryBackground",
            p: 0,
            pt: 1,
          }}
          onClick={() => {
            if (colorMode === "dark") {
              setColorMode("default");
            } else {
              setColorMode("dark");
            }
          }}
        >
          {colorMode === "dark" ? (
            <Moon size={24} color="#7C71FC" />
          ) : (
            <Sun size={24} color="#7C71FC" />
          )}
        </Button>
      </Flex>
      <Heading as="h1" mb={6}>
        Welcome
      </Heading>
      <Text variant="form" sx={{ mb: 2 }}>
        Private key
      </Text>
      <Input
        name="privateKey"
        type="text"
        placeholder="Enter private key here"
        onChange={(e) => setPrivateKey(e.target.value)}
        value={privateKey}
        autoComplete="off"
        mb={2}
      />
      {privateKey !== "" && !isPrivateKey(privateKey) && (
        <Text sx={{ mt: 2, color: "red" }} variant="form">
          Invalid private key, please try again.
        </Text>
      )}
      <Button
        variant="primary"
        mt={2}
        mb={4}
        onClick={() => {
          if (!isPrivateKey(privateKey)) {
            toast("Invalid private key. Please try again.");
            return;
          }
          savePoofAccount(privateKey, () => {
            history.push(`/${Page.DEPOSIT}`);
          });
        }}
      >
        Log in with Poof Account
      </Button>
      <DividerWithText text="or" />
      <Button variant="secondary" mt={4} onClick={goCreate}>
        Create a Poof account
      </Button>
      <Box
        mt={6}
        sx={{ color: "link", textDecoration: "none", textAlign: "center" }}
      >
        <RouterLink to={`/${Page.DEPOSIT}`}>Continue as guest</RouterLink>
      </Box>
    </>
  );
};
