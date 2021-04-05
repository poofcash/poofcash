import React from "react";
import { Flex, Text } from "theme-ui";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" style={{ textDecoration: "none", color: "black" }}>
      <Flex sx={{ alignItems: "center" }}>
        <Text sx={{ ml: 1 }} variant="logo">
          poof
        </Text>
      </Flex>
    </Link>
  );
};
