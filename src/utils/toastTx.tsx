import { BlockscoutTxLink } from "components/Links";
import { toast } from "react-toastify";
import { Text } from "theme-ui";

export const toastTx = (tx: string) => {
  toast(
    <>
      <Text>Transaction completed! </Text>
      <BlockscoutTxLink tx={tx}>View on Blockscout</BlockscoutTxLink>
    </>
  );
};
