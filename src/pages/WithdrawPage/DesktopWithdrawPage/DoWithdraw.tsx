import React from "react";
import web3 from "web3";
import { PickWithdraw } from "pages/WithdrawPage/MobileWithdrawPage/PickWithdraw";
import { Button, Container, Flex, Grid, Spinner, Text } from "theme-ui";
import { GrayBox } from "components/GrayBox";
import { useTranslation } from "react-i18next";
import { SummaryTable } from "components/SummaryTable";
import { GAS_HARDCODE, PRECISION } from "../MobileWithdrawPage/ConfirmWithdraw";
import { isValidNote, parseNote } from "utils/snarks-functions";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";
import { PoofKitGlobal } from "hooks/poofUtils";
import { PoofKitLoading } from "components/PoofKitLoading";

interface IProps {
  onWithdrawClick: () => void;
  setNote: (note: string) => void;
  note: string;
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
}

export const DoWithdraw: React.FC<IProps> = ({
  onWithdrawClick,
  setNote,
  note,
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
}) => {
  const { t } = useTranslation();
  const { currency, amount } = parseNote(note);
  const [loading, setLoading] = React.useState(false);
  const { poofKit, poofKitLoading } = PoofKitGlobal.useContainer();

  if (poofKitLoading) {
    return <PoofKitLoading />;
  }

  const relayerFee =
    (Number(amount) * Number(selectedRelayer?.relayerFee)) / 100 ?? 0;

  const finalWithdrawAmount = Number(amount) - relayerFee - GAS_HARDCODE;

  const handleWithdraw = async () => {
    if (!selectedRelayer) {
      alert("Relayer is undefined");
      return;
    }

    if (poofKitLoading) {
      alert("Poof kit is still loading");
      return;
    }

    setLoading(true);
    try {
      const txHash = await poofKit.withdrawNote(
        note,
        "0",
        recipient,
        selectedRelayer.url
      );
      setTxHash(txHash);
      onWithdrawClick();
    } catch (e) {
      if (e.response) {
        console.error(e.response.data.error);
      } else {
        console.debug(e);
        alert(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  let boxContent = (
    <>
      <Text sx={{ mb: 4 }} variant="subtitle">
        {t("withdraw.desktop.specify.title")}
      </Text>
      <Text variant="regularGray">
        {t("withdraw.desktop.specify.subtitle")}
      </Text>
    </>
  );
  if (isValidNote(note)) {
    boxContent = (
      <>
        <Text sx={{ mb: 4 }} variant="subtitle">
          {t("withdraw.desktop.review.title")}
        </Text>
        <SummaryTable
          title="Summary"
          lineItems={[
            {
              label: "Withdrawal Amount",
              value: `${amount} ${currency.toUpperCase()}`,
            },
            {
              label: `Relayer Fee - ${selectedRelayer?.relayerFee}%`,
              value: `-${relayerFee
                .toString()
                .slice(0, PRECISION)} ${currency.toUpperCase()}`,
            },
            { label: "Protocol Fee", value: `0 CELO` },
          ]}
          totalItem={{
            label: "Total",
            value: `${finalWithdrawAmount
              .toString()
              .slice(0, PRECISION)} ${currency.toUpperCase()}`,
          }}
        />
      </>
    );
  }

  return (
    <Grid sx={{ gridTemplateColumns: "1fr 1fr" }}>
      <Container>
        <Text variant="title">{t("withdraw.desktop.title")}</Text>
        <Text sx={{ mb: 4 }} variant="regularGray">
          {t("withdraw.desktop.subtitle")}
        </Text>
        <PickWithdraw
          loading={loading}
          onWithdrawClick={onWithdrawClick}
          setNote={setNote}
          note={note}
          setRecipient={setRecipient}
          recipient={recipient}
          selectedRelayer={selectedRelayer}
          setSelectedRelayer={setSelectedRelayer}
          relayerOptions={relayerOptions}
          usingCustomRelayer={usingCustomRelayer}
          setUsingCustomRelayer={setUsingCustomRelayer}
          customRelayer={customRelayer}
          setCustomRelayer={setCustomRelayer}
        />
      </Container>
      <Container>
        <GrayBox>{boxContent}</GrayBox>
        <Flex sx={{ justifyContent: "center" }}>
          {loading ? (
            <Spinner />
          ) : (
            <Button
              variant="primary"
              onClick={handleWithdraw}
              sx={{ width: "100%" }}
              disabled={(() => {
                if (!isValidNote(note)) {
                  return true;
                }
                if (!web3.utils.isAddress(recipient)) {
                  return true;
                }
                if (usingCustomRelayer) {
                  if (!customRelayer) {
                    return true;
                  }
                }
                return false;
              })()}
            >
              Withdraw
            </Button>
          )}
        </Flex>
      </Container>
    </Grid>
  );
};
