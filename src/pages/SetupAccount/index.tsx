import React from "react";
import { Login } from "pages/SetupAccount/Login";
import { CreateAccount } from "pages/SetupAccount/CreateAccount";
import { Box, Flex, Grid } from "theme-ui";
import { Route, Switch } from "react-router-dom";
import { Page } from "state/global";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";

export const SetupAccount: React.FC = () => {
  const breakpoint = useBreakpoint();

  return (
    <Grid
      sx={{
        gridGap: 4,
        gridTemplateColumns: ["100%", "50% 50%"],
        mt: ["15%", 0],
      }}
    >
      <Flex sx={{ flexDirection: "column", mr: [0, 4] }}>
        <Switch>
          <Route exact path={`/${Page.SETUP}`}>
            <Login />
          </Route>
          <Route exact path={`/${Page.SETUP_CREATE}`}>
            <CreateAccount />
          </Route>
        </Switch>
      </Flex>
      <Box
        sx={{
          display: breakpoint === Breakpoint.MOBILE ? "none" : "auto",
          left: "50vw",
          position: "absolute",
          height: "100vh",
          width: "50vw",
          backgroundColor: "secondaryBackground",
          my: -4,
        }}
      />
    </Grid>
  );
};
