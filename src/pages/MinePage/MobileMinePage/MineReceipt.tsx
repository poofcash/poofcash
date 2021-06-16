import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { BlockscoutTxLink } from "components/Links";
import moment from "moment";
import React from "react";
import { Button, Container, Flex, Text } from "theme-ui";
import { PRECISION } from "pages/MinePage/MobileMinePage/ConfirmMine";
import { SummaryTable } from "components/SummaryTable";

interface IProps {
  onDoneClick: () => void;
  estimatedAp: number;
  txHash: string;
}

export const MineReceipt: React.FC<IProps> = ({
  onDoneClick,
  estimatedAp,
  txHash,
}) => {
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
        ]}
        totalItem={{
          label: "AP Mined",
          value: `${estimatedAp.toString().slice(0, PRECISION)} AP`,
        }}
      />

      <BottomDrawer>
        <Flex sx={{ justifyContent: "space-between" }}>
          <LabelWithBalance
            label="Mined"
            amount={estimatedAp.toString().slice(0, PRECISION)}
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
