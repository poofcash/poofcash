import React from "react";
import { Box } from "theme-ui";

export const GrayBox: React.FC = ({ children }) => {
  return (
    <Box
      sx={{
        bg: "secondaryBackground",
        borderRadius: "6px",
        width: "100%",
        minHeight: "50%",
        my: 4,
        px: 3,
        py: 5,
      }}
    >
      {children}
    </Box>
  );
};
