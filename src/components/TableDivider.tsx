import React from "react";
import { Box } from "theme-ui";

interface IProps {
  columns: number;
}

export const TableDivider: React.FC<IProps> = ({ columns }) => {
  return (
    <Box
      sx={{
        my: "-8px",
        height: "1px",
        gridColumnStart: 1,
        gridColumnEnd: columns + 1,
        background: "#7C71FD",
      }}
    />
  );
};
