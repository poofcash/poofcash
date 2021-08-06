import React from "react";
import { PickRedeem } from "pages/RedeemPage/MobileRedeemPage/PickRedeem";
import { Container, Grid, Text } from "theme-ui";
import { GrayBox } from "components/GrayBox";
import { useTranslation } from "react-i18next";
import { SummaryTable } from "components/SummaryTable";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { humanFriendlyNumber } from "utils/number";
import { RelayerOption } from "hooks/useRelayer";

interface IProps {
  onRedeemClick: () => void;
  setAmount: (amount: string) => void;
  amount: string;
  poofAmount: string;
  setRecipient: (recipient: string) => void;
  recipient: string;
  setTxHash: (txHash: string) => void;
  selectedRelayer?: RelayerOption;
  setSelectedRelayer: (relayer?: RelayerOption) => void;
  relayerOptions?: Array<RelayerOption>;
  usingCustomRelayer: boolean;
  setUsingCustomRelayer: (usingCustomRelayer: boolean) => void;
  customRelayer?: RelayerOption;
  setCustomRelayer: (relayerOption?: RelayerOption) => void;
  relayerFee: string;
}

export const DoRedeem: React.FC<IProps> = ({
  onRedeemClick,
  setAmount,
  amount,
  poofAmount,
  setRecipient,
  recipient,
  setTxHash,
  selectedRelayer,
  setSelectedRelayer,
  relayerOptions,
  usingCustomRelayer,
  setUsingCustomRelayer,
  customRelayer,
  setCustomRelayer,
  relayerFee,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const { actWithPoofAccount } = PoofAccountGlobal.useContainer();
  const { poofKit, poofKitLoading } = PoofKitGlobal.useContainer();

  const handleRedeem = async () => {
    if (!selectedRelayer) {
      alert("Relayer is undefined");
      return;
    }
    if (poofKitLoading) {
      alert("Poof kit is still loading");
      return;
    }

    setLoading(true);
    actWithPoofAccount(
      (privateKey) => {
        poofKit
          ?.swap(privateKey, amount, recipient, selectedRelayer.url)
          .then((txHash) => {
            if (txHash) {
              setTxHash(txHash);
              onRedeemClick();
            } else {
              alert(
                "No response from relayer. Check your account in the explorer or try again"
              );
            }
          })
          .catch((e) => {
            if (e.response) {
              console.error(e.response.data.error);
            } else {
              console.debug(e);
              alert(e.message);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      },
      () => setLoading(false)
    );
  };

  let boxContent = (
    <>
      <Text sx={{ mb: 4 }} variant="subtitle">
        {t("redeem.desktop.specify.title")}
      </Text>
      <br />
      <Text variant="regularGray">{t("redeem.desktop.specify.subtitle")}</Text>
    </>
  );
  if (Number(amount) > 0) {
    boxContent = (
      <>
        <Text sx={{ mb: 4 }} variant="subtitle">
          {t("redeem.desktop.review.title")}
        </Text>
        <br />
        <SummaryTable
          title="Summary"
          lineItems={[
            {
              label: "AP",
              value: `${Number(amount).toLocaleString()} AP`,
            },
            {
              label: `Relayer Fee`,
              value: `${Number(relayerFee).toLocaleString()} AP`,
            },
          ]}
          totalItem={{
            label: "Total",
            value: `${humanFriendlyNumber(poofAmount)} POOF`,
          }}
        />
      </>
    );
  }

  return (
    <Grid sx={{ gridTemplateColumns: "1.3fr 1fr", gridGap: 6 }}>
      <Container>
        <Text sx={{ display: "block" }} variant="title">
          {t("redeem.desktop.title")}
        </Text>
        <Text sx={{ display: "block", mb: 4 }} variant="regularGray">
          {t("redeem.desktop.subtitle")}
        </Text>
        <PickRedeem
          loading={loading}
          onRedeemClick={handleRedeem}
          setAmount={setAmount}
          amount={amount}
          poofAmount={poofAmount}
          setRecipient={setRecipient}
          recipient={recipient}
          selectedRelayer={selectedRelayer}
          setSelectedRelayer={setSelectedRelayer}
          relayerOptions={relayerOptions}
          usingCustomRelayer={usingCustomRelayer}
          setUsingCustomRelayer={setUsingCustomRelayer}
          customRelayer={customRelayer}
          setCustomRelayer={setCustomRelayer}
          relayerFee={relayerFee}
        />
      </Container>
      <Container>
        <GrayBox>{boxContent}</GrayBox>
      </Container>
    </Grid>
  );
};
