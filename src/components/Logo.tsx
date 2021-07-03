import React from "react";
import { Flex, Text, useColorMode } from "theme-ui";
import { Link } from "react-router-dom";
import { Moon, Sun } from "react-feather";

export const Logo: React.FC = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <Link to="/" style={{ textDecoration: "none", color: "black" }}>
      <Flex sx={{ alignItems: "center" }}>
        <Text variant="logo">poof</Text>
        <Text mx={2}>/</Text>
        {colorMode === "dark" ? (
          <Moon
            color="white"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setColorMode("default");
            }}
            size={16}
          />
        ) : (
          <Sun
            style={{ cursor: "pointer" }}
            onClick={() => {
              setColorMode("dark");
            }}
            size={16}
          />
        )}
      </Flex>
    </Link>
  );
};
