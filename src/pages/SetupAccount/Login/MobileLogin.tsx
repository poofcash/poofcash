import React from "react";
import { Box, Button, Flex, useColorMode, Heading } from "theme-ui";
import { Page } from "state/global";
import { RouterLink } from "components/RouterLink";
import { Moon, Sun } from "phosphor-react";
import { FullLogo } from "components/FullLogo";
import { PickLogin } from "pages/SetupAccount/PickLogin";

export const MobileLogin: React.FC = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <>
      <Flex
        sx={{
          justifyContent: "space-between",
          width: "100%",
          mb: ["25%", "10%"],
        }}
      >
        <FullLogo />
        <Button
          sx={{
            width: "36px",
            height: "36px",
            backgroundColor: "secondaryBackground",
            p: 0,
            pt: 1,
          }}
          onClick={() => {
            if (colorMode === "dark") {
              setColorMode("default");
            } else {
              setColorMode("dark");
            }
          }}
        >
          {colorMode === "dark" ? (
            <Moon size={24} color="#7C71FC" />
          ) : (
            <Sun size={24} color="#7C71FC" />
          )}
        </Button>
      </Flex>
      <Heading as="h1" mb={6}>
        Welcome
      </Heading>
      <PickLogin />
      <Box
        mt={6}
        sx={{ color: "link", textDecoration: "none", textAlign: "center" }}
      >
        <RouterLink to={`/${Page.DEPOSIT}`}>Continue as guest</RouterLink>
      </Box>
    </>
  );
};
