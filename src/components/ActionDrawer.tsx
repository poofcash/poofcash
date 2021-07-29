import { Container } from "theme-ui";
import { BottomDrawer } from "./BottomDrawer";

export const ActionDrawer: React.FC = ({ children }) => {
  return (
    <BottomDrawer>
      <Container
        sx={{
          borderTop: "1px solid #E0E0E0",
          p: 3,
          backgroundColor: "background",
        }}
      >
        {children}
      </Container>
    </BottomDrawer>
  );
};
