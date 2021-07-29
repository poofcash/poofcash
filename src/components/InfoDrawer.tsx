import { Container, useColorMode } from "theme-ui";
import { BottomDrawer } from "components/BottomDrawer";

export const InfoDrawer: React.FC = ({ children }) => {
  const [colorMode] = useColorMode();
  return (
    <BottomDrawer>
      <Container
        sx={{
          backgroundColor:
            colorMode === "dark" ? "secondaryBackground" : "background",
          p: 4,
          boxShadow: "0px 0px 12px rgba(66, 66, 66, 0.16)",
          borderRadius: "16px 16px 0px 0px",
        }}
      >
        {children}
      </Container>
    </BottomDrawer>
  );
};
