import React from "react";
import { Button, Checkbox, Flex, Text } from "theme-ui";
import { useTranslation } from "react-i18next";
import Web3 from "web3";
import { PoofPrivateKey } from "components/PoofPrivateKey";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { useDispatch } from "react-redux";
import { Page, setCurrentPage } from "state/global";

interface IProps {
  goBack: () => void;
}

const web3 = new Web3();

export const CreateAccount: React.FC<IProps> = ({ goBack }) => {
  const { t } = useTranslation();
  const privateKey = React.useMemo(
    () => web3.eth.accounts.create().privateKey.slice(2),
    []
  );
  const [confirmed, setConfirmed] = React.useState(false);
  const { savePoofAccount } = PoofAccountGlobal.useContainer();
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
        <Button variant="secondary" mr={2} onClick={goBack}>
          Back
        </Button>
        <Button
          disabled={!confirmed}
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
