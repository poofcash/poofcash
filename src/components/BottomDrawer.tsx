import React from "react";
import { Container } from "theme-ui";

// For now, BottomDrawer always expects 2 elements so that it can do
// space-between
export const BottomDrawer: React.FC = ({ children }) => {
  return (
    <Container
      sx={{
        background: "white",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.12)",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        py: 3,
        px: 3,
      }}
    >
      {children}
    </Container>
  );
};
