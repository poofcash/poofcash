import React from "react";
import { Container } from "theme-ui";

// For now, BottomDrawer always expects 2 elements so that it can do
// space-between
export const BottomDrawer: React.FC = ({ children }) => {
  return (
    <Container
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
      }}
    >
      {children}
    </Container>
  );
};
