import React from "react";
import { BackButton } from "components/BackButton";
import Valora from "images/valora.png";
import Ledger from "images/ledger.png";
import CEW from "images/cew.png";
import { Text, Flex, Image } from "@theme-ui/components";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { NETWORK } from "config";
import { requestValoraAuth } from "connectors/valora/valoraUtils";
import { injected, valora } from "connectors";
import { useTranslation } from "react-i18next";

const IconText: React.FC<{
  onClick: () => void;
  icon: string;
  text: string;
}> = ({ onClick, icon, text }) => {
  return (
    <Flex
      sx={{ alignItems: "center", cursor: "pointer", my: 4 }}
      onClick={onClick}
    >
      <Image sx={{ mr: 3 }} src={icon} />
      <Text variant="regular">{text}</Text>
    </Flex>
  );
};

interface IProps {
  goBack: () => void;
  selectIndex: () => void;
}

export const SelectWallet: React.FC<IProps> = ({ goBack, selectIndex }) => {
  const { t } = useTranslation();
  const { activate } = useWeb3React();

  const connectCeloExtensionWallet = async () => {
    await activate(injected, undefined, true).catch((e) => {
      if (e instanceof UnsupportedChainIdError) {
        alert(
          `Unexpected chain. Are you sure your wallet is on the ${NETWORK} network?`
        );
      }
    });
  };

  const connectValoraWallet = async () => {
    const resp = await requestValoraAuth();
    valora.setSavedValoraAccount(resp);
    activate(valora, undefined, true).catch(alert);
  };

  return (
    <>
      <BackButton onClick={goBack} />
      <Text sx={{ mb: 2 }} variant="title">
        {t("connectWallet.selectWallet.title")}
      </Text>
      <Text sx={{ mb: 5 }} variant="regularGray">
        {t("connectWallet.selectWallet.description")}
      </Text>
      <IconText
        onClick={() => {
          connectValoraWallet();
          goBack();
        }}
        icon={Valora}
        text="Valora"
      />
      <div
        style={{
          border: "1px solid #F1F4F4",
        }}
      ></div>
      <IconText onClick={selectIndex} icon={Ledger} text="Ledger" />
      <div
        style={{
          border: "1px solid #F1F4F4",
        }}
      ></div>
      <IconText
        onClick={() => {
          connectCeloExtensionWallet();
          goBack();
        }}
        icon={CEW}
        text="Celo Extension Wallet"
      />
    </>
  );
};
