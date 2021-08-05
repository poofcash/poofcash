import { Flex, Text } from "theme-ui";
import { humanFriendlyNumber } from "utils/number";

interface Props {
  apRate: string | number;
  poofRate: string | number;
  depositApr: number;
}

export const DepositStats: React.FC<Props> = ({
  apRate,
  poofRate,
  depositApr,
}) => {
  return (
    <>
      <Flex mt={3}>
        <Text sx={{ mr: 1 }} variant="primary">
          {Number(apRate).toLocaleString()} AP
        </Text>
        <Text> / block</Text>
      </Flex>
      <Flex mt={3}>
        <Text sx={{ mr: 1 }} variant="primary">
          {humanFriendlyNumber(poofRate)} POOF
        </Text>
        <Text>/ week</Text>
      </Flex>
      <Flex mt={3}>
        <Text sx={{ mr: 1 }} variant="primary">
          {humanFriendlyNumber(depositApr * 100)}% APR
        </Text>
      </Flex>
    </>
  );
};
