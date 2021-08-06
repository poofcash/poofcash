import React from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useTranslation } from "react-i18next";
import { Button, Container, Flex, Grid, Spinner, Text } from "theme-ui";
import { toWei, toBN } from "web3-utils";
import { GrayBox } from "components/GrayBox";
import { SummaryTable } from "components/SummaryTable";
import { humanFriendlyNumber } from "utils/number";
import { toast } from "react-toastify";
import { toastTx } from "utils/toastTx";
import { ExchangeMode } from "hooks/exchange/useExchangeMode";
import { PickExchange } from "./PickExchange";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";
import { ActionDrawer } from "components/ActionDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";

interface IProps {
  openReceiptPage: () => void;
  fromCurrency: string;
  setFromCurrency: (currency: string) => void;
  toCurrency: string;
  setToCurrency: (currency: string) => void;
  setTxHash: (txHash: string) => void;
  fromAmount: string;
  setFromAmount: (amount: string) => void;
  toAmount: string;
  setToAmount: (amount: string) => void;
  fromBalance: string;
  fromAllowance: string;
  exchangeRate: string;
  refetch: () => void;
  exchangeCall: () => Promise<string | undefined>;
  approveCall: () => any;
  allowance: string;
  exchangeMode: ExchangeMode;
}

export const DoExchange: React.FC<IProps> = ({
  openReceiptPage,
  fromCurrency,
  setFromCurrency,
  fromAmount,
  setFromAmount,
  toCurrency,
  setToCurrency,
  exchangeRate,
  toAmount,
  setToAmount,
  fromBalance,
  refetch,
  exchangeCall,
  approveCall,
  allowance,
  setTxHash,
  exchangeMode,
}) => {
  const { t } = useTranslation();
  const { performActions, address, connect } = useContractKit();
  const [loading, setLoading] = React.useState(false);
  const breakpoint = useBreakpoint();

  const onExchangeClick = () => {
    setLoading(true);
    performActions(async () => {
      try {
        const txHash = await exchangeCall();
        if (txHash) {
          toastTx(txHash);
          setTxHash(txHash);
          openReceiptPage();
        } else {
          toast("Failed to exchange");
        }
      } catch (e) {
        toast(e);
        console.error(e);
      } finally {
        refetch();
        setLoading(false);
      }
    });
  };

  const connectWalletButton = (
    <Button variant="primary" onClick={() => connect().then(console.warn)}>
      Connect Wallet
    </Button>
  );

  const approveButton = (
    <Button
      onClick={approveCall}
      disabled={!address || Number(fromAmount) <= 0}
    >
      Approve {fromCurrency}
    </Button>
  );

  const exchangeButton = (
    <Button
      onClick={onExchangeClick}
      disabled={Number(fromAmount) <= 0 || !address}
    >
      Swap
    </Button>
  );

  let button = connectWalletButton;
  if (address) {
    if (toBN(allowance).lt(toBN(toWei(fromAmount === "" ? "0" : fromAmount)))) {
      button = approveButton;
    } else {
      button = exchangeButton;
    }
  }

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

  if (address && fromAmount === "0") {
    boxContent = (
      <>
        <Text sx={{ mb: 4 }} variant="subtitle">
          {t("exchange.select.title")}
        </Text>
        <br />
        <Text variant="regularGray">{t("exchange.select.subtitle")}</Text>
      </>
    );
  } else if (address) {
    boxContent = (
      <>
        <Text sx={{ mb: 4 }} variant="subtitle">
          {t("exchange.review.title")}
        </Text>
        <br />
        <SummaryTable
          title="Summary"
          lineItems={[
            {
              label: "Exchange",
              value: `${humanFriendlyNumber(fromAmount)} ${fromCurrency}`,
            },
          ]}
          totalItem={{
            label: "Receive",
            value: `${humanFriendlyNumber(toAmount)} ${toCurrency}`,
          }}
        />
      </>
    );
  }

  return (
    <Grid sx={{ gridTemplateColumns: ["1fr", "1.3fr 1fr"], gridGap: 6 }}>
      <Container>
        <Text sx={{ display: "block" }} variant="title">
          {t("exchange.title")}
        </Text>
        <Text sx={{ display: "block", mb: 4 }} variant="regularGray">
          {t("exchange.subtitle")}
        </Text>
        <PickExchange
          fromCurrency={fromCurrency}
          setFromCurrency={setFromCurrency}
          toCurrency={toCurrency}
          setToCurrency={setToCurrency}
          fromAmount={fromAmount}
          setFromAmount={setFromAmount}
          fromBalance={fromBalance}
          toAmount={toAmount}
          setToAmount={setToAmount}
          exchangeMode={exchangeMode}
          exchangeRate={exchangeRate}
        />
        {breakpoint === Breakpoint.DESKTOP && (
          <Container mt={4}>{loading ? <Spinner /> : button}</Container>
        )}
      </Container>
      {breakpoint === Breakpoint.DESKTOP && (
        <Container>
          <GrayBox>{boxContent}</GrayBox>
        </Container>
      )}
      {breakpoint === Breakpoint.MOBILE && (
        <ActionDrawer>
          <Flex
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <LabelWithBalance
              label="Total"
              amount={fromAmount === "" ? "0" : fromAmount}
              currency={fromCurrency}
            />
            {button}
          </Flex>
        </ActionDrawer>
      )}
    </Grid>
  );
};
