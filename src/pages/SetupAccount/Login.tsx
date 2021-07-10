import React from "react";
import { Button, Container, Flex, Input, Text } from "theme-ui";
import { useTranslation } from "react-i18next";
import { usePoofAccount } from "hooks/poofAccount";
import { useDispatch } from "react-redux";
import { Page, setCurrentPage } from "state/global";
import { isPrivateKey } from "utils/eth";

interface IProps {
  goBack: () => void;
}

export const Login: React.FC<IProps> = ({ goBack }) => {
  const { t } = useTranslation();
  const [privateKey, setPrivateKey] = React.useState("");
  const { savePoofAccount } = usePoofAccount();
  const dispatch = useDispatch();

  return (
    <Flex
      sx={{
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Text sx={{ mb: 2 }} variant="title">
        {t("setup.login.title")}
      </Text>
      <Text sx={{ mb: 5 }} variant="regularGray">
        {t("setup.login.subtitle")}
      </Text>
      {/* TODO: text validation */}
      <Container sx={{ maxWidth: 500, textAlign: "left" }}>
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
        />
        {privateKey !== "" && !isPrivateKey(privateKey) && (
          <Text sx={{ mt: 2, color: "red" }} variant="form">
            Invalid private key, please try again.
          </Text>
        )}
      </Container>
      <Flex sx={{ justifyContent: "center", mt: 4 }}>
        <Button variant="secondary" mr={2} onClick={goBack}>
          Back
        </Button>
        <Button
          disabled={!isPrivateKey(privateKey)}
          onClick={() => {
            savePoofAccount(privateKey, () => {
              dispatch(setCurrentPage({ nextPage: Page.DEPOSIT }));
              goBack();
            });
          }}
        >
          Continue
        </Button>
      </Flex>
    </Flex>
  );
};
