import { BlockscoutTxLink } from "components/Links";
import moment from "moment";
import React from "react";
import { Button, Container, Text } from "theme-ui";
import { GrayBox } from "components/GrayBox";
import { SummaryTable } from "components/SummaryTable";

interface IProps {
  onDoneClick: () => void;
  txHash: string;
  estimatedAp: number;
}

export const MineReceipt: React.FC<IProps> = ({
  onDoneClick,
  txHash,
  estimatedAp,
}) => {
  return (
    <Container>
      <Text sx={{ mb: 1 }} variant="title">
        Alakazam!
      </Text>
      <br />
      <Text sx={{ mb: 4 }} variant="regularGray">
        Your AP has been mined.{" "}
        <BlockscoutTxLink tx={txHash}>View transaction</BlockscoutTxLink>.
      </Text>
      <br />

      <GrayBox>
        <Text sx={{ mb: 3 }} variant="subtitle">
          Receipt
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
            value: `${Number(estimatedAp).toLocaleString()} AP`,
          }}
        />
      </GrayBox>

      <Button sx={{ mt: 2, px: 6 }} variant="done" onClick={onDoneClick}>
        Done
      </Button>
    </Container>
  );
};
