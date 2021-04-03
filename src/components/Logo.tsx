import React from "react";
import { Flex, Text } from "theme-ui";
import { Link } from "react-router-dom";
import { LogoIcon } from "icons/LogoIcon";

export const Logo = () => {
  return (
    <Link to="/" style={{ textDecoration: "none", color: "black" }}>
      <Flex sx={{ alignItems: "center" }}>
        <LogoIcon />
        <Text sx={{ ml: 1 }} variant="logo">
          poof
        </Text>
      </Flex>
    </Link>
  );
};
