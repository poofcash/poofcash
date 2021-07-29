import { Box, Flex, Text } from "theme-ui";

interface Props {
  text: string;
}

export const DividerWithText: React.FC<Props> = ({ text }) => {
  return (
    <Flex sx={{ alignItems: "center" }}>
      <Box
        sx={{
          borderBottom: "1.25px solid #E0E0E0",
          height: 0,
          width: "100%",
          mr: 4,
        }}
      />
      <Text>{text}</Text>
      <Box
        sx={{
          borderBottom: "1.25px solid #E0E0E0",
          height: 0,
          width: "100%",
          ml: 4,
        }}
      />
    </Flex>
  );
};
