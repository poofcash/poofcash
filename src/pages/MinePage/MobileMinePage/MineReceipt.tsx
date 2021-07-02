import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { BlockscoutTxLink } from "components/Links";
import moment from "moment";
import React from "react";
import { Button, Container, Flex, Text } from "theme-ui";
import { SummaryTable } from "components/SummaryTable";

interface IProps {
  onDoneClick: () => void;
  estimatedAp: number;
  txHash: string;
  relayerFee: string;
}

export const MineReceipt: React.FC<IProps> = ({
  onDoneClick,
  estimatedAp,
  txHash,
  relayerFee,
}) => {
  const totalMined = estimatedAp - Number(relayerFee);

  return (
    <Container>
      <Text sx={{ mb: 1 }} variant="subtitle">
        Alakazam!
      </Text>
      <br />
      <Text sx={{ mb: 4 }} variant="regularGray">
        Your AP has been mined.{" "}
        <BlockscoutTxLink tx={txHash}>View transaction</BlockscoutTxLink>.
      </Text>
      <br />

      <SummaryTable
        title="Transaction"
        lineItems={[
          {
            label: "Time completed",
            value: moment().format("h:mm a"),
          },
          {
            label: "Relayer fee",
            value: `${Number(relayerFee).toLocaleString()} AP`,
          },
        ]}
        totalItem={{
          label: "AP Mined",
          value: `${totalMined.toLocaleString()} AP`,
        }}
      />

      <BottomDrawer>
        <Flex sx={{ justifyContent: "space-between" }}>
          <LabelWithBalance
            label="Mined"
            amount={Number(estimatedAp).toLocaleString()}
            currency="AP"
          />
          <Button
            onClick={() => {
              onDoneClick();
            }}
            variant="done"
          >
            Done
          </Button>
        </Flex>
      </BottomDrawer>
    </Container>
  );
};
