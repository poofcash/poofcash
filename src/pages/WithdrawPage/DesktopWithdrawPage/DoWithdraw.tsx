import React from "react";
import { PickWithdraw } from "pages/WithdrawPage/MobileWithdrawPage/PickWithdraw";
import { Box, Container, Grid, Text } from "theme-ui";
import { GrayBox } from "components/GrayBox";
import { useTranslation } from "react-i18next";
import { SummaryTable } from "components/SummaryTable";
import { isValidNote, parseNote } from "utils/snarks-functions";
import { humanFriendlyNumber } from "utils/number";
import { formatCurrency } from "utils/currency";
import { RelayerOption } from "hooks/useRelayer";
import { NoteList, NoteListMode } from "components/DepositList";
import { PoofKitGlobal } from "hooks/usePoofKit";

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
  relayerFee: string;
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
  relayerFee,
}) => {
  const { t } = useTranslation();
  const { currency, amount } = parseNote(note);
  const [loading, setLoading] = React.useState(false);
  const { poofKit, poofKitLoading } = PoofKitGlobal.useContainer();

  const finalWithdrawAmount = Number(amount) - Number(relayerFee);

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
      const txHash = await poofKit?.withdrawNote(
        note,
        "0",
        recipient,
        selectedRelayer.url
      );
      if (txHash) {
        setTxHash(txHash);
        onWithdrawClick();
      } else {
        alert(
          "No response from relayer. Check your account in the explorer or try again"
        );
      }
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
      <br />
      <Text variant="regularGray">
        {t("withdraw.desktop.specify.subtitle")}
      </Text>
    </>
  );
  if (isValidNote(note)) {
    boxContent = (
      <>
        <SummaryTable
          lineItems={[
            {
              label: "Withdrawal Amount",
              value: `${humanFriendlyNumber(amount)} ${formatCurrency(
                currency
              )}`,
            },
            {
              label: `Relayer Fee - ${selectedRelayer?.relayerFee}%`,
              value: `- ${humanFriendlyNumber(relayerFee)} ${formatCurrency(
                currency
              )}`,
            },
            { label: "Protocol Fee", value: `0 ${formatCurrency(currency)}` },
          ]}
          totalItem={{
            label: "Total",
            value: `${humanFriendlyNumber(
              finalWithdrawAmount
            )} ${formatCurrency(currency)}`,
          }}
        />
      </>
    );
  }

  return (
    <Grid sx={{ gridTemplateColumns: "1.3fr 1fr", gridGap: 6 }}>
      <Container>
        <Text sx={{ display: "block" }} variant="title">
          {t("withdraw.desktop.title")}
        </Text>
        <Text sx={{ display: "block", mb: 4 }} variant="regularGray">
          {t("withdraw.desktop.subtitle")}
        </Text>
        <PickWithdraw
          loading={loading}
          onWithdrawClick={handleWithdraw}
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
        <Box>
          <NoteList mode={NoteListMode.DEPOSITS} onFill={setNote} />
        </Box>
      </Container>
    </Grid>
  );
};
