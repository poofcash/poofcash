import React from "react";
import { Box, Text, Flex } from "theme-ui";
import { Page } from "state/global";
import { RouterLink } from "components/RouterLink";
import { PickLogin } from "pages/SetupAccount/PickLogin";
import { CaretLeft } from "phosphor-react";
import { StyledLink } from "components/StyledLink";

export const DesktopLogin: React.FC = () => {
  return (
    <>
      <Box>
        <Box mb="10%">
          <StyledLink to={`${Page.DEPOSIT}`}>
            <Flex sx={{ alignItems: "center" }}>
              <CaretLeft size={28} />
              <Text color="primaryText">back to app</Text>
            </Flex>
          </StyledLink>
        </Box>
        <Text sx={{ display: "block" }} variant="title">
          Log In
        </Text>
        <Text sx={{ display: "block", mb: 4 }} variant="regularGray">
          Enter your private key to log into your Poof account
        </Text>
        <PickLogin />
        <Box
          mt={6}
          sx={{ color: "link", textDecoration: "none", textAlign: "center" }}
        >
          <RouterLink to={`/${Page.DEPOSIT}`}>Continue as guest</RouterLink>
        </Box>
      </Box>
    </>
  );
};
