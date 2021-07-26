import React from "react";
import { Logo } from "components/Logo";
import { Box, Button } from "theme-ui";
import { Page } from "state/global";
import { RouterLink } from "components/RouterLink";

interface IProps {
  goCreate: () => void;
  goLogin: () => void;
}

export const SelectLogin: React.FC<IProps> = ({ goCreate, goLogin }) => {
  return (
    <>
      <Logo />
      <Button variant="primary" mt={4} onClick={goCreate}>
        Create a Poof account
      </Button>
      <Button variant="secondary" mt={2} onClick={goLogin}>
        Log in
      </Button>
      <Box mt={6} sx={{ color: "link", textDecoration: "none" }}>
        <RouterLink to={`/${Page.DEPOSIT}`}>Continue as guest</RouterLink>
      </Box>
    </>
  );
};
