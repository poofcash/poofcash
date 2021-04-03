import React from "react";
import { Divider as ThemeDivider } from "theme-ui";

export const Divider: React.FC = () => {
  return (
    <ThemeDivider
      sx={{
        height: "1.5px",
        color: "#7C71FD",
      }}
    />
  );
};
