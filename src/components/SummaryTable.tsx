import React from "react";
import { Grid, Text } from "theme-ui";
import { Divider } from "components/Divider";
import { TableDivider } from "components/TableDivider";

type LabelValuePair = {
  label: string;
  value?: string | null;
};

interface IProps {
  title: string;
  lineItems: Array<LabelValuePair>;
  totalItem: LabelValuePair;
}

export const SummaryTable: React.FC<IProps> = ({
  title,
  lineItems,
  totalItem,
}) => {
  return (
    <>
      <Text variant="summaryTitle">{title}</Text>
      <Divider />
      <Grid columns={[2]} sx={{ mb: 4 }}>
        {lineItems.map(({ label, value }, idx) => {
          return (
            <React.Fragment key={idx}>
              <Text variant="form">{label}</Text>
              <Text sx={{ textAlign: "right" }} variant="bold">
                {value}
              </Text>
            </React.Fragment>
          );
        })}
        <TableDivider columns={2} />
        <Text variant="subtitle">{totalItem.label}</Text>
        <Text sx={{ textAlign: "right" }} variant="bold">
          {totalItem.value}
        </Text>
      </Grid>
    </>
  );
};
