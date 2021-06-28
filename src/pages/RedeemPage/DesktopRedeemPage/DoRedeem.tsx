import React from "react";
import { PickRedeem } from "pages/RedeemPage/MobileRedeemPage/PickRedeem";
import { Button, Container, Flex, Grid, Spinner, Text } from "theme-ui";
import { GrayBox } from "components/GrayBox";
import { useTranslation } from "react-i18next";
import { SummaryTable } from "components/SummaryTable";
import { usePoofAccount } from "hooks/poofAccount";
import { PoofKitGlobal } from "hooks/poofUtils";
import { useDispatch } from "react-redux";
import { Page, setCurrentPage } from "state/global";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";
import { humanFriendlyNumber } from "utils/number";

interface IProps {
  onRedeemClick: () => void;
  setAmount: (amount: string) => void;
  amount: string;
  poofAmount: string;
  setRecipient: (recipient: string) => void;
  recipient: string;
  setMaxRedeemAmount: (amount: string) => void;
  maxRedeemAmount?: string;
  setTxHash: (txHash: string) => void;
  selectedRelayer?: RelayerOption;
  setSelectedRelayer: (relayer?: RelayerOption) => void;
  relayerOptions?: Array<RelayerOption>;
  usingCustomRelayer: boolean;
  setUsingCustomRelayer: (usingCustomRelayer: boolean) => void;
  customRelayer?: RelayerOption;
  setCustomRelayer: (relayerOption?: RelayerOption) => void;
}

export const DoRedeem: React.FC<IProps> = ({
  onRedeemClick,
  setAmount,
  amount,
  poofAmount,
  setRecipient,
  recipient,
  setMaxRedeemAmount,
  maxRedeemAmount,
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
  const [loading, setLoading] = React.useState(false);
  const { poofAccount, actWithPoofAccount } = usePoofAccount();
  const dispatch = useDispatch();
  const { poofKit, poofKitLoading } = PoofKitGlobal.useContainer();

  const unlockPoofAccount = async () => {
    actWithPoofAccount(
      (privateKey) => {
        poofKit
          ?.apBalance(privateKey)
          .then((apBalance) => setMaxRedeemAmount(apBalance.toString()))
          .catch(console.error);
      },
      () => {}
    );
  };

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
            setTxHash(txHash);
            onRedeemClick();
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
              value: `${amount} AP`,
            },
            {
              label: `Relayer Fee`,
              value: `-${0} AP`,
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
        onClick={unlockPoofAccount}
        sx={{ width: "100%" }}
      >
        Unlock Poof account
      </Button>
    );
    if (maxRedeemAmount != null) {
      button = (
        <Button
          variant="primary"
          onClick={handleRedeem}
          sx={{ width: "100%" }}
          disabled={(() => {
            if (poofKitLoading) {
              return true;
            }
            if (amount === "" || recipient === "") {
              return true;
            }
            if (Number(amount) > Number(maxRedeemAmount)) {
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
          Redeem
        </Button>
      );
    }
  }

  return (
    <Grid sx={{ gridTemplateColumns: "1fr 1fr" }}>
      <Container>
        <Text variant="title">{t("redeem.desktop.title")}</Text>
        <br />
        <Text sx={{ mb: 4 }} variant="regularGray">
          {t("redeem.desktop.subtitle")}
        </Text>
        <br />
        <PickRedeem
          loading={loading}
          onRedeemClick={onRedeemClick}
          setAmount={setAmount}
          amount={amount}
          poofAmount={poofAmount}
          setRecipient={setRecipient}
          recipient={recipient}
          maxRedeemAmount={maxRedeemAmount}
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
