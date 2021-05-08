import React from "react";
import { BackButton } from "components/BackButton";
import { Button, Text } from "@theme-ui/components";
import { useWeb3React } from "@web3-react/core";
import {
  LedgerConnector,
  NUM_LEDGER_ACCOUNT_IDXS,
} from "connectors/ledger/LedgerConnector";
import { useTranslation } from "react-i18next";
import { Select } from "theme-ui";

interface IProps {
  goBack: () => void;
  onDone: () => void;
}

export const SelectIndex: React.FC<IProps> = ({ goBack, onDone }) => {
  const { t } = useTranslation();
  const { activate } = useWeb3React();
  const [index, setIndex] = React.useState(0);

  const connectLedgerWallet = async () => {
    await activate(new LedgerConnector(index), undefined, true).catch((e) => {
      console.error(e);
      alert(e);
    });
  };

  return (
    <>
      <BackButton onClick={goBack} />
      <Text sx={{ mb: 2 }} variant="title">
        {t("connectWallet.selectIndex.title")}
      </Text>
      <Text sx={{ mb: 5 }} variant="regularGray">
        {t("connectWallet.selectIndex.description")}
      </Text>
      <Select
        sx={{ width: 64 }}
        onChange={(e) => setIndex(Number(e.target.value))}
      >
        {Array(NUM_LEDGER_ACCOUNT_IDXS)
          .fill(0)
          .map((_, idx) => (
            <option key={idx} value={idx}>
              {idx}
            </option>
          ))}
      </Select>
      <Button
        mt={4}
        onClick={() => {
          connectLedgerWallet();
          goBack();
          onDone();
        }}
      >
        Confirm
      </Button>
    </>
  );
};
