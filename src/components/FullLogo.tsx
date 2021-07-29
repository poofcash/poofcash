import { LogoIcon } from "icons/LogoIcon";
import { Flex, Text } from "theme-ui";

export const FullLogo: React.FC = () => {
  return (
    <Flex sx={{ alignItems: "center" }}>
      <LogoIcon size={42} />
      <Text
        sx={{
          fontWeight: 600,
          fontSize: 28,
          lineHeight: "38px",
          color: "purple300",
        }}
      >
        poof
      </Text>
    </Flex>
  );
};
