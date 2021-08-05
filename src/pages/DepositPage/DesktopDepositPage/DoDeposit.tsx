import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Grid, Text } from "theme-ui";
import { PickDeposit } from "pages/DepositPage/MobileDepositPage/PickDeposit";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { SummaryTable } from "components/SummaryTable";
import { NETWORK_COST } from "pages/DepositPage/MobileDepositPage/ConfirmDeposit";
import { GrayBox } from "components/GrayBox";
import { useContractKit } from "@celo-tools/use-contractkit";
import { humanFriendlyNumber } from "utils/number";
import { DepositStats } from "components/Deposit/DepositStats";
import { useMiningRate } from "hooks/useMiningRate";
import { Divider } from "components/Divider";

interface IProps {
  onDepositClick?: () => void;
  setAmount: (amount: string) => void;
  amount: string;
  setCurrency: (currency: string) => void;
  currency: string;
  notes: NoteStringCommitment[];
  setUsingCustom: (usingCustom: boolean) => void;
  usingCustom: boolean;
  actualAmount: string;
  depositLoading: boolean;
}

export const DoDeposit: React.FC<IProps> = ({
  onDepositClick,
  amount,
  setAmount,
  currency,
  setCurrency,
  notes,
  setUsingCustom,
  usingCustom,
  actualAmount,
}) => {
  const { t } = useTranslation();
  const { address } = useContractKit();
  const { apRate, poofRate, depositApr } = useMiningRate();

  let boxContent = (
    <>
      <Text sx={{ mb: 4 }} variant="subtitle">
        {t("deposit.desktop.connectWallet.title")}
      </Text>
      <br />
      <Text variant="regularGray">
        {t("deposit.desktop.connectWallet.subtitle")}
      </Text>
    </>
  );

  if (address && notes.length === 0) {
    boxContent = (
      <>
        <Text sx={{ mb: 4 }} variant="subtitle">
          {t("deposit.desktop.select.title")}
        </Text>
        <br />
        <Text variant="regularGray">
          {t("deposit.desktop.select.subtitle")}
        </Text>
      </>
    );
  } else if (address) {
    boxContent = (
      <>
        <Text sx={{ mb: 4 }} variant="subtitle">
          {t("deposit.desktop.review.title")}
        </Text>
        <br />
        <DepositStats
          apRate={apRate}
          poofRate={poofRate}
          depositApr={depositApr}
        />
        <Divider my={4} />
        <SummaryTable
          lineItems={[
            {
              label: "Deposit Amount",
              value: `${humanFriendlyNumber(actualAmount)} ${currency}`,
            },
            {
              label: "Est. Network Fee",
              value: `${humanFriendlyNumber(NETWORK_COST)} CELO`,
            },
          ]}
          totalItem={{
            label: "Est. Total",
            value:
              currency === "CELO"
                ? `${humanFriendlyNumber(
                    Number(actualAmount) + Number(NETWORK_COST)
                  )} CELO`
                : `${humanFriendlyNumber(
                    Number(actualAmount)
                  )} ${currency} + ${humanFriendlyNumber(NETWORK_COST)} CELO`,
          }}
        />
      </>
    );
  }

  return (
    <>
      <Grid sx={{ gridTemplateColumns: "1.3fr 1fr", gridGap: 6 }}>
        <Container>
          <Text sx={{ display: "block" }} variant="title">
            {t("deposit.desktop.title")}
          </Text>
          <Text sx={{ display: "block", mb: 4 }} variant="regularGray">
            {t("deposit.desktop.subtitle")}
          </Text>
          <PickDeposit
            onDepositClick={onDepositClick}
            amount={amount}
            setAmount={setAmount}
            currency={currency}
            setCurrency={setCurrency}
            setUsingCustom={setUsingCustom}
            usingCustom={usingCustom}
            actualAmount={actualAmount}
            notes={notes}
          />
        </Container>
        <Container>
          <GrayBox>{boxContent}</GrayBox>
        </Container>
      </Grid>
    </>
  );
};
