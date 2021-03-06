import React from "react";
import { Button, Container, Flex, Spinner, Text } from "theme-ui";
import { BackButton } from "components/BackButton";
import { ActionDrawer } from "components/ActionDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { SummaryTable } from "components/SummaryTable";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { PoofKitLoading } from "components/PoofKitLoading";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { RelayerOption } from "hooks/useRelayer";
import { getPoofEvents } from "utils/getPoofEvents";
import { Note } from "@poofcash/poof-kit";
import { getMinerEvents } from "utils/getMinerEvents";
import { getTreeEvents } from "utils/getTreeEvents";

interface IProps {
  onBackClick: () => void;
  onConfirmClick: () => void;
  note: string;
  estimatedAp: number;
  setTxHash: (txHash: string) => void;
  selectedRelayer: RelayerOption;
  relayerFee: string;
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
  relayerFee,
}) => {
  const { poofKit, poofKitLoading } = PoofKitGlobal.useContainer();
  const [loading, setLoading] = React.useState(false);

  const { actWithPoofAccount } = PoofAccountGlobal.useContainer();

  if (poofKitLoading) {
    return <PoofKitLoading />;
  }

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
      async (privateKey) => {
        try {
          const depositEvents = (await getPoofEvents("Deposit", poofKit))[
            Note.getInstance(note)
          ];
          const withdrawalEvents = (await getPoofEvents("Withdrawal", poofKit))[
            Note.getInstance(note)
          ];
          const accountEvents = await getMinerEvents("NewAccount", poofKit);
          const depositDataEvents = await getTreeEvents("DepositData", poofKit);
          const withdrawalDataEvents = await getTreeEvents(
            "WithdrawalData",
            poofKit
          );

          const txHash = await poofKit?.reward(
            privateKey,
            note,
            selectedRelayer.url,
            depositEvents,
            withdrawalEvents,
            accountEvents,
            depositDataEvents,
            withdrawalDataEvents
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
            if (e.message.includes("already spent")) {
              alert(e.message);
            } else {
              alert(
                `${e.message}. This can happen if the trees contract has not been updated since your withdrawal. The contract updates once every few minutes, so try again later.`
              );
            }
          }
        } finally {
          setLoading(false);
        }
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
      <ActionDrawer>
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
      </ActionDrawer>
    </Container>
  );
};
