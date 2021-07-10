import React from "react";
import { PickMine } from "pages/MinePage/MobileMinePage/PickMine";
import { Button, Container, Flex, Grid, Spinner, Text } from "theme-ui";
import { GrayBox } from "components/GrayBox";
import { useTranslation } from "react-i18next";
import { SummaryTable } from "components/SummaryTable";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { useDispatch } from "react-redux";
import { Page, setCurrentPage } from "state/global";
import { RelayerOption } from "hooks/useRelayer";

interface IProps {
  onMineClick: () => void;
  setNote: (note: string) => void;
  note: string;
  noteIsValid: boolean;
  estimatedAp: number;
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

export const DoMine: React.FC<IProps> = ({
  onMineClick,
  setNote,
  note,
  noteIsValid,
  estimatedAp,
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
  const { poofKit, poofKitLoading } = PoofKitGlobal.useContainer();
  const dispatch = useDispatch();

  const { poofAccount, actWithPoofAccount } = PoofAccountGlobal.useContainer();

  const totalMineAmount = Number(estimatedAp) - Number(relayerFee);

  const handleMine = async () => {
    if (!selectedRelayer) {
      alert("Relayer is undefined");
      return;
    }

    if (poofKitLoading) {
      alert("Poof kit is still initializing");
      return;
    }

    setLoading(true);
    actWithPoofAccount(
      (privateKey) => {
        poofKit
          ?.reward(privateKey, note, selectedRelayer.url)
          .then((txHash) => {
            if (txHash) {
              setTxHash(txHash);
              onMineClick();
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
              if (e.message.includes("already spent")) {
                alert(e.message);
              } else {
                alert(
                  `${e.message}. This can happen if the trees contract has not been updated since your withdrawal. The contract updates once every few minutes, so try again later.`
                );
              }
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
        {t("mine.desktop.specify.title")}
      </Text>
      <br />
      <Text variant="regularGray">{t("mine.desktop.specify.subtitle")}</Text>
    </>
  );
  if (noteIsValid) {
    boxContent = (
      <>
        <Text sx={{ mb: 4 }} variant="subtitle">
          {t("mine.desktop.review.title")}
        </Text>
        <br />
        <SummaryTable
          title="Summary"
          lineItems={[
            {
              label: "AP",
              value: `${Number(estimatedAp).toLocaleString()} AP`,
            },
            {
              label: `Relayer Fee`,
              value: `-${Number(relayerFee).toLocaleString()} AP`,
            },
          ]}
          totalItem={{
            label: "Total",
            value: `${Number(totalMineAmount).toLocaleString()} AP`,
          }}
        />
      </>
    );
  }

  let button = (
    <Button
      variant="primary"
      onClick={() => dispatch(setCurrentPage({ nextPage: Page.SETUP }))}
      sx={{ width: "100%" }}
    >
      Connect Poof account
    </Button>
  );
  if (poofAccount) {
    button = (
      <Button
        variant="primary"
        onClick={handleMine}
        sx={{ width: "100%" }}
        disabled={(() => {
          if (poofKitLoading) {
            return true;
          }
          if (!noteIsValid) {
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
        Mine
      </Button>
    );
  }

  return (
    <Grid sx={{ gridTemplateColumns: "1fr 1fr" }}>
      <Container>
        <Text variant="title">{t("mine.desktop.title")}</Text>
        <br />
        <Text sx={{ mb: 4 }} variant="regularGray">
          {t("mine.desktop.subtitle")}
        </Text>
        <br />
        <PickMine
          loading={loading}
          onMineClick={onMineClick}
          setNote={setNote}
          note={note}
          noteIsValid={noteIsValid}
          estimatedAp={estimatedAp}
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
          {loading ? <Spinner /> : button}
        </Flex>
      </Container>
    </Grid>
  );
};
