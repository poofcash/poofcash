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
import { useApprove } from "hooks/writeContract";
import { GrayBox } from "components/GrayBox";
import { CURRENCY_MAP } from "config";
import { useTokenBalance } from "hooks/useTokenBalance";
import { InsufficientBalanceModal } from "components/InsufficientBalanceModal";
import { useContractKit } from "@celo-tools/use-contractkit";
import { toBN, toWei } from "web3-utils";
import { humanFriendlyNumber } from "utils/number";
import { deployments } from "@poofcash/poof-kit";
import { useDispatch } from "react-redux";
import { Page, setCurrentPage } from "state/global";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { NoteList } from "components/NoteList";

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
  poofRate: string;
  apRate: string;
  backup: boolean;
  setBackup: (backup: boolean) => void;
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
  depositLoading,
  poofRate,
  apRate,
  backup,
  setBackup,
}) => {
  const { t } = useTranslation();
  const { address, connect, network } = useContractKit();

  const [confirmed, setConfirmed] = React.useState(false);
  const [
    showInsufficientBalanceModal,
    setShowInsufficientBalanceModal,
  ] = React.useState(false);

  const [allowance, approve, approveLoading] = useApprove(
    deployments[`netId${network.chainId}`][currency.toLowerCase()].tokenAddress,
    toWei(actualAmount)
  );
  const userBalance = useTokenBalance(
    CURRENCY_MAP[network.chainId][currency.toLowerCase()],
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
    if (toBN(userBalance).lt(toBN(toWei(actualAmount)))) {
      button = (
        <Button variant="primary" disabled={true} sx={{ width: "100%" }}>
          Insufficient Balance
        </Button>
      );
    } else if (toBN(allowance).lt(toBN(toWei(actualAmount)))) {
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
          disabled={!address || Number(actualAmount) === 0 || !confirmed}
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
          disabled={!address || Number(actualAmount) === 0 || !confirmed}
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
        <SummaryTable
          title="Summary"
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
        <Text sx={{ mt: 6, mb: 1 }} variant="subtitle">
          Magic Password
        </Text>
        <br />
        <Text sx={{ mb: 3 }} variant="regularGray">
          Keep these notes safe to withdraw the deposited money later
        </Text>
        <br />
        <NoteList notes={notes.map((note) => note.noteString)} />
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
            amount={amount}
            setAmount={setAmount}
            currency={currency}
            setCurrency={setCurrency}
            setUsingCustom={setUsingCustom}
            usingCustom={usingCustom}
            actualAmount={actualAmount}
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
        neededAmount={amount}
      />
    </>
  );
};
