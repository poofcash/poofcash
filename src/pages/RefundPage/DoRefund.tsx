import React from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import RefundMetadata from "abis/Refund.json";
import { useTranslation } from "react-i18next";
import { Box, Button, Container, Flex, Text } from "theme-ui";
import { AbiItem, toWei } from "web3-utils";
import { Refund } from "generated/Refund";
import { REFUND_CONTRACT } from "config";
import { toastTx } from "utils/toastTx";

interface IProps {
  refundAmount: string;
}

export const DoRefund: React.FC<IProps> = ({ refundAmount }) => {
  const { t } = useTranslation();
  const { performActions } = useContractKit();

  const onRedeemClick = () => {
    performActions(async (kit) => {
      const refund = (new kit.web3.eth.Contract(
        RefundMetadata.abi as AbiItem[],
        REFUND_CONTRACT
      ) as unknown) as Refund;
      const tx = await refund.methods.claim().send({
        from: kit.defaultAccount,
        gasPrice: toWei("0.1", "gwei"),
      });
      toastTx(tx.transactionHash);
    });
  };

  return (
    <Box>
      <Container>
        <Text variant="title">{t("refund.title")}</Text>
        <br />
        <Text sx={{ mb: 4 }} variant="regularGray">
          {t("refund.subtitle")}
        </Text>
        <br />

        <Flex sx={{ flexDirection: "column", alignItems: "center", mt: 6 }}>
          <Text sx={{ display: "block" }} variant="reallyBigNumber" mb={2}>
            {refundAmount} ULP
          </Text>
          <Text>Refundable LP</Text>
          <Button
            mt={4}
            onClick={onRedeemClick}
            disabled={refundAmount === "0"}
          >
            Redeem
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};
