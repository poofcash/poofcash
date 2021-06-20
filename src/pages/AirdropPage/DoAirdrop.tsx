import React from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { PoofKitV2 } from "@poofcash/poof-kit";
import { useTranslation } from "react-i18next";
import { Box, Button, Container, Flex, Text } from "theme-ui";
import { toWei } from "web3-utils";

interface IProps {
  openReceiptPage: () => void;
  redeemAmount: string;
  setTxHash: (txHash: string) => void;
}

export const DoAirdrop: React.FC<IProps> = ({
  setTxHash,
  redeemAmount,
  openReceiptPage,
}) => {
  const { t } = useTranslation();
  const { performActions } = useContractKit();

  const onRedeemClick = () => {
    performActions(async (kit) => {
      const poofKit = new PoofKitV2(kit);
      const txo = await poofKit.redeem();
      const tx = await kit.sendTransactionObject(txo, {
        from: kit.defaultAccount,
        gasPrice: toWei("0.1", "gwei"),
      });
      setTxHash(await tx.getHash());
      openReceiptPage();
    });
  };

  return (
    <Box>
      <Container>
        <Text variant="title">{t("airdrop.title")}</Text>
        <br />
        <Text sx={{ mb: 4 }} variant="regularGray">
          {t("airdrop.subtitle")}
        </Text>
        <br />

        <Flex sx={{ flexDirection: "column", alignItems: "center", mt: 6 }}>
          <Text variant="reallyBigNumber">{redeemAmount} vPOOF</Text>
          <Text>Redeemable vouchers</Text>
          <Button
            mt={4}
            onClick={onRedeemClick}
            disabled={redeemAmount === "0"}
          >
            Redeem
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};
