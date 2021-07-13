import React from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  Container,
  Flex,
  Grid,
  Spinner,
  Text,
} from "theme-ui";
import { PickDeposit } from "pages/DepositPage/MobileDepositPage/PickDeposit";
import { NoteStringCommitment } from "pages/DepositPage/types";
import { SummaryTable } from "components/SummaryTable";
import { NETWORK_COST } from "pages/DepositPage/MobileDepositPage/ConfirmDeposit";
import { NoteString } from "components/NoteString";
import { useApprove } from "hooks/writeContract";
import { GrayBox } from "components/GrayBox";
import { CHAIN_ID, CURRENCY_MAP } from "config";
import { useTokenBalance } from "hooks/readContract";
import { InsufficientBalanceModal } from "components/InsufficientBalanceModal";
import { useContractKit } from "@celo-tools/use-contractkit";
import { toBN, toWei } from "web3-utils";
import { humanFriendlyNumber } from "utils/number";
import { deployments } from "@poofcash/poof-kit";
import { useDispatch } from "react-redux";
import { Page, setCurrentPage } from "state/global";
import { PoofAccountGlobal } from "hooks/poofAccount";

interface IProps {
  onDepositClick?: () => void;
  setSelectedAmount: (amount: string) => void;
  selectedAmount: string;
  setSelectedCurrency: (currency: string) => void;
  selectedCurrency: string;
  noteStringCommitment: NoteStringCommitment;
  depositLoading: boolean;
  poofRate: string;
  apRate: string;
  backup: boolean;
  setBackup: (backup: boolean) => void;
}

export const DoDeposit: React.FC<IProps> = ({
  onDepositClick,
  selectedAmount,
  setSelectedAmount,
  selectedCurrency,
  setSelectedCurrency,
  noteStringCommitment,
  depositLoading,
  poofRate,
  apRate,
  backup,
  setBackup,
}) => {
  const { t } = useTranslation();
  const { address, connect } = useContractKit();

  const [confirmed, setConfirmed] = React.useState(false);
  const [
    showInsufficientBalanceModal,
    setShowInsufficientBalanceModal,
  ] = React.useState(false);

  const [allowance, approve, approveLoading] = useApprove(
    deployments[`netId${CHAIN_ID}`][selectedCurrency.toLowerCase()]
      .tokenAddress,
    toWei(selectedAmount)
  );
  const userBalance = useTokenBalance(
    CURRENCY_MAP[selectedCurrency.toLowerCase()],
    address
  );
  const dispatch = useDispatch();
  const { poofAccount } = PoofAccountGlobal.useContainer();

  const loading = approveLoading || depositLoading;

  let button = (
    <Button variant="primary" onClick={connect} sx={{ width: "100%" }}>
      Connect Wallet
    </Button>
  );
  if (address) {
    if (toBN(userBalance).lt(toBN(toWei(selectedAmount)))) {
      button = (
        <Button variant="primary" disabled={true} sx={{ width: "100%" }}>
          Insufficient Balance
        </Button>
      );
    } else if (toBN(allowance).lt(toBN(toWei(selectedAmount)))) {
      button = (
        <Button
          variant="primary"
          onClick={() =>
            approve().catch((e) => {
              console.error(e);
              alert(e);
            })
          }
          sx={{ width: "100%" }}
          disabled={!address || selectedAmount === "0" || !confirmed}
        >
          Approve
        </Button>
      );
    } else if (!poofAccount && backup) {
      button = (
        <Button
          variant="primary"
          onClick={() => dispatch(setCurrentPage({ nextPage: Page.SETUP }))}
          sx={{ width: "100%" }}
        >
          Connect Poof account
        </Button>
      );
    } else {
      button = (
        <Button
          variant="primary"
          onClick={onDepositClick}
          sx={{ width: "100%" }}
          disabled={!address || selectedAmount === "0" || !confirmed}
        >
          Deposit
        </Button>
      );
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

  if (address && selectedAmount === "0") {
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
        <SummaryTable
          title="Summary"
          lineItems={[
            {
              label: "Deposit Amount",
              value: `${humanFriendlyNumber(
                selectedAmount
              )} ${selectedCurrency}`,
            },
            {
              label: "Est. Network Fee",
              value: `${humanFriendlyNumber(NETWORK_COST)} CELO`,
            },
          ]}
          totalItem={{
            label: "Est. Total",
            value:
              selectedCurrency === "CELO"
                ? `${humanFriendlyNumber(
                    Number(selectedAmount) + Number(NETWORK_COST)
                  )} CELO`
                : `${humanFriendlyNumber(
                    selectedAmount
                  )} ${selectedCurrency} + ${humanFriendlyNumber(
                    NETWORK_COST
                  )} CELO`,
          }}
        />
        <Text sx={{ mt: 6, mb: 1 }} variant="subtitle">
          Magic Password
        </Text>
        <br />
        <Text sx={{ mb: 3 }} variant="regularGray">
          Keep this note safe to withdraw the deposited money later
        </Text>
        <br />
        <NoteString noteString={noteStringCommitment.noteString} />
        <Flex
          sx={{ mt: 4, alignItems: "center" }}
          onClick={() => setConfirmed(!confirmed)}
        >
          <Checkbox readOnly checked={confirmed} />
          <Text sx={{ pt: 1 }}>I backed up the Magic Password</Text>
        </Flex>
        <Flex
          sx={{ mt: 4, alignItems: "center" }}
          onClick={() => setBackup(!backup)}
        >
          <Checkbox readOnly checked={backup} />
          <Text sx={{ pt: 1 }}>Create an on-chain backup</Text>
        </Flex>
      </>
    );
  }

  return (
    <>
      <Grid sx={{ gridTemplateColumns: "1fr 1fr" }}>
        <Container>
          <Text variant="title">{t("deposit.desktop.title")}</Text>
          <br />
          <Text sx={{ mb: 4 }} variant="regularGray">
            {t("deposit.desktop.subtitle")}
          </Text>
          <br />
          <PickDeposit
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            poofRate={poofRate}
            apRate={apRate}
          />
        </Container>
        <Container>
          <GrayBox>{boxContent}</GrayBox>
          <Flex sx={{ justifyContent: "center" }}>
            {loading ? <Spinner /> : button}
          </Flex>
        </Container>
      </Grid>
      <InsufficientBalanceModal
        onClose={() => setShowInsufficientBalanceModal(false)}
        show={showInsufficientBalanceModal}
        neededAmount={selectedAmount}
      />
    </>
  );
};
