import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "index";
import React from "react";
import { Button, Container, Flex, Spinner, Text } from "theme-ui";
import { parseNote } from "utils/snarks-functions";
import { BackButton } from "components/BackButton";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { SummaryTable } from "components/SummaryTable";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";
import { useContractKit } from "@celo-tools/use-contractkit";
import { PoofKitV2 } from "@poofcash/poof-kit";
import { CHAIN_ID } from "config";
import { formatCurrency } from "utils/currency";
import { humanFriendlyNumber } from "utils/number";

interface IProps {
  onBackClick: () => void;
  onConfirmClick: () => void;
  note: string;
  recipient: string;
  setTxHash: (txHash: string) => void;
  selectedRelayer: RelayerOption;
}

export const PRECISION = 7;
export const GAS_HARDCODE = 0.0000470652;

export const ConfirmWithdraw: React.FC<IProps> = ({
  onBackClick,
  onConfirmClick,
  note,
  recipient,
  setTxHash,
  selectedRelayer,
}) => {
  const { library: networkLibrary } = useWeb3React(NetworkContextName);
  const { kit } = useContractKit();
  const { currency, amount } = parseNote(note);
  const [loading, setLoading] = React.useState(false);

  const relayerFee = (Number(amount) * selectedRelayer.relayerFee) / 100;

  const finalWithdrawAmount = Number(amount) - relayerFee;

  const handleWithdraw = async () => {
    if (!networkLibrary) {
      console.error("Library is not defined");
      return;
    }

    if (!selectedRelayer) {
      alert("Relayer is undefined");
      return;
    }

    setLoading(true);
    const poofKit = new PoofKitV2(kit, CHAIN_ID);
    try {
      await poofKit.initialize(window.groth16);
      const txHash = await poofKit.withdrawNote(
        note,
        "0",
        recipient,
        selectedRelayer.url
      );
      setTxHash(txHash);
      onConfirmClick();
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

  return (
    <Container>
      <BackButton onClick={onBackClick} />
      <br />
      <Text sx={{ mb: 1 }} variant="subtitle">
        Transaction Summary
      </Text>
      <br />
      <Text sx={{ mb: 4 }} variant="regularGray">
        Please review the transaction before continuing
      </Text>
      <br />

      <SummaryTable
        title="Summary"
        lineItems={[
          {
            label: "Withdrawal Amount",
            value: `${humanFriendlyNumber(amount)} ${formatCurrency(currency)}`,
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
          value: `${humanFriendlyNumber(finalWithdrawAmount)} ${formatCurrency(
            currency
          )}`,
        }}
      />
      <BottomDrawer>
        {loading ? (
          <Flex sx={{ justifyContent: "flex-end" }}>
            <Spinner />
          </Flex>
        ) : (
          <Flex sx={{ justifyContent: "space-between" }}>
            <LabelWithBalance
              label="Total"
              amount={finalWithdrawAmount}
              currency={currency}
            />
            <Button onClick={handleWithdraw}>Withdraw</Button>
          </Flex>
        )}
      </BottomDrawer>
    </Container>
  );
};
