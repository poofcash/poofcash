import React from "react";
import { Button, Container, Flex, Spinner, Text } from "theme-ui";
import { BackButton } from "components/BackButton";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { SummaryTable } from "components/SummaryTable";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";
import { PoofKitGlobal } from "hooks/poofUtils";
import { PoofKitLoading } from "components/PoofKitLoading";
import { usePoofAccount } from "hooks/poofAccount";

interface IProps {
  onBackClick: () => void;
  onConfirmClick: () => void;
  amount: string;
  poofAmount: string;
  recipient: string;
  setTxHash: (txHash: string) => void;
  selectedRelayer: RelayerOption;
}

export const PRECISION = 7;
export const GAS_HARDCODE = 0.0000470652;

export const ConfirmRedeem: React.FC<IProps> = ({
  onBackClick,
  onConfirmClick,
  amount,
  poofAmount,
  recipient,
  setTxHash,
  selectedRelayer,
}) => {
  const [loading, setLoading] = React.useState(false);

  const { actWithPoofAccount } = usePoofAccount();
  const { poofKit, poofKitLoading } = PoofKitGlobal.useContainer();

  if (poofKitLoading) {
    return <PoofKitLoading />;
  }

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
            onConfirmClick();
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
          value: `${poofAmount.slice(0, PRECISION)} POOF`,
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
              amount={poofAmount}
              currency="POOF"
            />
            <Button onClick={handleRedeem}>Redeem</Button>
          </Flex>
        )}
      </BottomDrawer>
    </Container>
  );
};
