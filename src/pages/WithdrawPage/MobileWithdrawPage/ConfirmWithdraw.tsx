import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "index";
import React from "react";
import { Button, Container, Flex, Spinner, Text } from "theme-ui";
import { parseNote } from "utils/snarks-functions";
import { BackButton } from "components/BackButton";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { SummaryTable } from "components/SummaryTable";
import { formatCurrency } from "utils/currency";
import { humanFriendlyNumber } from "utils/number";
import { RelayerOption } from "hooks/useRelayer";
import { PoofKitGlobal } from "hooks/poofUtils";
import { PoofKitLoading } from "components/PoofKitLoading";

interface IProps {
  onBackClick: () => void;
  onConfirmClick: () => void;
  note: string;
  recipient: string;
  setTxHash: (txHash: string) => void;
  selectedRelayer: RelayerOption;
  relayerFee: string;
}

export const PRECISION = 7;

export const ConfirmWithdraw: React.FC<IProps> = ({
  onBackClick,
  onConfirmClick,
  note,
  recipient,
  setTxHash,
  selectedRelayer,
  relayerFee,
}) => {
  const { library: networkLibrary } = useWeb3React(NetworkContextName);
  const { currency, amount } = parseNote(note);
  const [loading, setLoading] = React.useState(false);
  const { poofKit, poofKitLoading } = PoofKitGlobal.useContainer();

  if (poofKitLoading) {
    return <PoofKitLoading />;
  }

  const finalWithdrawAmount = Number(amount) - Number(relayerFee);

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
    try {
      const txHash = await poofKit.withdrawNote(
        note,
        "0",
        recipient,
        selectedRelayer.url
      );
      if (txHash) {
        setTxHash(txHash);
        onConfirmClick();
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
