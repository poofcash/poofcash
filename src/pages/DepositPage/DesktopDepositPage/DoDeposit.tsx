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
import {
  ApprovalState,
  DepositState,
  useApproveCallback,
} from "hooks/writeContract";
import { GrayBox } from "components/GrayBox";
import { CELO, TokenAmount } from "@ubeswap/sdk";
import { CHAIN_ID } from "config";
import { instances } from "@poofcash/poof-token";
import { BigNumber } from "@ethersproject/bignumber";
import { useGetTokenBalance } from "hooks/readContract";
import { InsufficientBalanceModal } from "components/InsufficientBalanceModal";
import { useContractKit } from "@celo-tools/use-contractkit";

interface IProps {
  onDepositClick?: () => void;
  setSelectedAmount: (amount: string) => void;
  selectedAmount: string;
  setSelectedCurrency: (currency: string) => void;
  selectedCurrency: string;
  noteStringCommitment: NoteStringCommitment;
  depositState: DepositState;
}

export const DoDeposit: React.FC<IProps> = ({
  onDepositClick,
  selectedAmount,
  setSelectedAmount,
  selectedCurrency,
  setSelectedCurrency,
  noteStringCommitment,
  depositState,
}) => {
  const { t } = useTranslation();
  const { address } = useContractKit();

  const [confirmed, setConfirmed] = React.useState(false);
  const [
    showInsufficientBalanceModal,
    setShowInsufficientBalanceModal,
  ] = React.useState(false);

  const tornadoAddress = React.useMemo(
    () =>
      instances[`netId${CHAIN_ID}`][selectedCurrency].instanceAddress[
        selectedAmount
      ],
    [selectedCurrency, selectedAmount]
  );
  const [accountBalance, setAccountBalance] = React.useState<number>();
  const [approvalState, approveCallback] = useApproveCallback(
    new TokenAmount(
      CELO[CHAIN_ID],
      // Only supports up to 2 decimal places
      selectedAmount !== ""
        ? BigNumber.from(100 * Number(selectedAmount))
            .mul(BigNumber.from(10).pow(16))
            .toString()
        : "0"
    ),
    tornadoAddress
  );
  const getAccountBalance = useGetTokenBalance(CELO[CHAIN_ID], address);
  React.useEffect(() => {
    if (address) {
      getAccountBalance()
        .then((tokenAmount) => setAccountBalance(Number(tokenAmount.toExact())))
        .catch(console.error);
    }
  }, [getAccountBalance, address]);
  const approveHandler = async () => {
    if (!address) {
      return;
    }
    if (!accountBalance) {
      alert("Your account has insufficient funds.");
      return;
    }
    if (accountBalance < Number(selectedAmount)) {
      setShowInsufficientBalanceModal(true);
      return;
    }

    approveCallback();
  };

  const loading =
    approvalState === ApprovalState.PENDING ||
    approvalState === ApprovalState.WAITING_CONFIRMATIONS ||
    depositState === DepositState.PENDING;

  const approveButton = (
    <Button
      variant="primary"
      onClick={approveHandler}
      sx={{ width: "100%" }}
      disabled={!address || selectedAmount === "" || !confirmed}
    >
      Approve
    </Button>
  );

  const depositButton = (
    <Button
      variant="primary"
      onClick={onDepositClick}
      sx={{ width: "100%" }}
      disabled={!address || selectedAmount === "" || !confirmed}
    >
      Deposit
    </Button>
  );

  let button = depositButton;
  if (address) {
    if (approvalState === ApprovalState.NOT_APPROVED) {
      button = approveButton;
    }
  }

  let boxContent = (
    <>
      <Text sx={{ mb: 4 }} variant="subtitle">
        {t("deposit.desktop.connectWallet.title")}
      </Text>
      <Text variant="regularGray">
        {t("deposit.desktop.connectWallet.subtitle")}
      </Text>
    </>
  );

  const totalCost = Number(selectedAmount) + Number(NETWORK_COST);

  if (address && selectedAmount === "") {
    boxContent = (
      <>
        <Text sx={{ mb: 4 }} variant="subtitle">
          {t("deposit.desktop.select.title")}
        </Text>
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
        <SummaryTable
          title="Summary"
          lineItems={[
            {
              label: "Deposit Amount",
              value: `${selectedAmount} ${selectedCurrency.toUpperCase()}`,
            },
            {
              label: "Est. Network Fee",
              value: `${NETWORK_COST} CELO`,
            },
          ]}
          totalItem={{
            label: "Est. Total",
            value: `${totalCost} CELO`,
          }}
        />
        <Text sx={{ mt: 6, mb: 1 }} variant="subtitle">
          Magic Password
        </Text>
        <Text sx={{ mb: 3 }} variant="regularGray">
          Keep this note safe to withdraw the deposited money later
        </Text>
        <NoteString noteString={noteStringCommitment.noteString} />
        <Flex
          sx={{ mt: 4, alignItems: "center" }}
          onClick={() => setConfirmed(!confirmed)}
        >
          <Checkbox readOnly checked={confirmed} />
          <Text sx={{ pt: 1 }}>I backed up the Magic Password</Text>
        </Flex>
      </>
    );
  }

  return (
    <>
      <Grid sx={{ gridTemplateColumns: "1fr 1fr" }}>
        <Container>
          <Text variant="title">{t("deposit.desktop.title")}</Text>
          <Text sx={{ mb: 4 }} variant="regularGray">
            {t("deposit.desktop.subtitle")}
          </Text>
          <PickDeposit
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
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
