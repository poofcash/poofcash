import React from "react";
import Web3 from "web3";
import { Button, Checkbox, Flex, Text } from "theme-ui";
import { useTranslation } from "react-i18next";
import { PoofPrivateKey } from "components/PoofPrivateKey";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { Page } from "state/global";
import { useHistory, Link } from "react-router-dom";

const web3 = new Web3();

export const CreateAccount: React.FC = () => {
  const { t } = useTranslation();
  const privateKey = React.useMemo(
    () => web3.eth.accounts.create().privateKey.slice(2),
    []
  );
  const [confirmed, setConfirmed] = React.useState(false);
  const { savePoofAccount } = PoofAccountGlobal.useContainer();
  const history = useHistory();

  return (
    <Flex
      sx={{
        flexDirection: "column",
        mt: [0, "20%"],
      }}
    >
      <Text sx={{ mb: 2 }} variant="title">
        {t("setup.create.title")}
      </Text>
      <Text sx={{ mb: 5 }} variant="regularGray">
        {t("setup.create.subtitle")}
      </Text>
      <PoofPrivateKey privateKey={privateKey} />
      <Flex
        sx={{ mt: 4, alignItems: "center" }}
        onClick={() => setConfirmed(!confirmed)}
      >
        <Checkbox readOnly checked={confirmed} />
        <Text sx={{ pt: 1 }}>I backed up my private key</Text>
      </Flex>
      <Flex sx={{ justifyContent: "center", mt: 4 }}>
        <Link to={`/${Page.SETUP}`}>
          <Button variant="secondary" mr={2}>
            Back
          </Button>
        </Link>
        <Button
          disabled={!confirmed}
          onClick={() => {
            savePoofAccount(privateKey, () => {
              history.push(`/${Page.DEPOSIT}`);
            });
          }}
        >
          Continue
        </Button>
      </Flex>
    </Flex>
  );
};
