import React from "react";
import { Button, Container, Flex, Spinner, Text } from "theme-ui";
import { BackButton } from "components/BackButton";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { SummaryTable } from "components/SummaryTable";
import { usePoofAccount } from "hooks/poofAccount";
import { PoofKitLoading } from "components/PoofKitLoading";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";
import { PoofKitGlobal } from "hooks/poofUtils";

interface IProps {
  onBackClick: () => void;
  onConfirmClick: () => void;
  note: string;
  estimatedAp: number;
  setTxHash: (txHash: string) => void;
  selectedRelayer: RelayerOption;
}

export const PRECISION = 7;
export const GAS_HARDCODE = 0.0000470652;

export const ConfirmMine: React.FC<IProps> = ({
  onBackClick,
  onConfirmClick,
  note,
  estimatedAp,
  setTxHash,
  selectedRelayer,
}) => {
  const { poofKit, poofKitLoading } = PoofKitGlobal.useContainer();
  const [loading, setLoading] = React.useState(false);

  const { actWithPoofAccount } = usePoofAccount();

  if (poofKitLoading) {
    return <PoofKitLoading />;
  }

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
            setTxHash(txHash);
            onConfirmClick();
          })
          .catch((e) => {
            if (e.response) {
              console.error(e.response.data.error);
            } else {
              console.debug(e);
              alert(
                `${e.message}. This can happen if the trees contract has not been updated since your withdrawal. The contract updates once every few minutes, so try again later.`
              );
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
            value: `${Number(estimatedAp).toLocaleString} AP`,
          },
          {
            label: `Relayer Fee`,
            value: `-${0} AP`,
          },
        ]}
        totalItem={{
          label: "Total",
          value: `${Number(estimatedAp).toLocaleString} AP`,
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
              amount={estimatedAp}
              currency="AP"
            />
            <Button onClick={handleMine}>Mine</Button>
          </Flex>
        )}
      </BottomDrawer>
    </Container>
  );
};
