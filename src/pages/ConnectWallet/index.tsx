import React from "react";
import { Text, Flex, Image } from "@theme-ui/components";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { NETWORK } from "config";
import { requestValoraAuth } from "connectors/valora/valoraUtils";
import { injected, ledger, valora } from "connectors";
import Modal from "react-modal";
import { isMobile, isDesktop } from "react-device-detect";
import { BackButton } from "components/BackButton";
import Valora from "images/valora.png";
import Ledger from "images/ledger.png";
import CEW from "images/cew.png";

interface IProps {
  isOpen: boolean;
  goBack: () => void;
}

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

export const ConnectWallet: React.FC<IProps> = ({ isOpen, goBack }) => {
  const { activate } = useWeb3React();
  const connectLedgerWallet = async () => {
    await activate(ledger, undefined, true).catch(alert);
  };

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
    <Modal
      isOpen={isOpen}
      onRequestClose={goBack}
      style={{ content: { top: 0, left: 0, width: "100%", height: "100%" } }}
    >
      <BackButton onClick={goBack} />
      <Text sx={{ mb: 2 }} variant="title">
        Connect your wallet
      </Text>
      <Text sx={{ mb: 5 }} variant="regularGray">
        To deposit cryptocurrency with Poof, you must connect to a wallet with
        funds.
      </Text>
      {isMobile && (
        <>
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
        </>
      )}
      <IconText
        onClick={() => {
          connectLedgerWallet();
          goBack();
        }}
        icon={Ledger}
        text="Ledger"
      />
      {isDesktop && (
        <>
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
      )}
    </Modal>
  );
};
