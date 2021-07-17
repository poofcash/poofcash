import React from "react";
import { getNoteStringAndCommitment } from "utils/snarks-functions";
import { DoDeposit } from "pages/DepositPage/DesktopDepositPage/DoDeposit";
import { DepositReceipt } from "pages/DepositPage/DesktopDepositPage/DepositReceipt";
import { IDepositProps } from "pages/DepositPage";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { useContractKit } from "@celo-tools/use-contractkit";

enum DepositStep {
  DO = "DO",
  RECEIPT = "RECEIPT",
}

const DesktopDepositPage: React.FC<IDepositProps> = ({
  setSelectedAmount,
  selectedAmount,
  setSelectedCurrency,
  selectedCurrency,
  setNoteStringCommitment,
  noteStringCommitment,
  txHash,
  deposit,
  depositLoading,
  poofRate,
  apRate,
  backup,
  setBackup,
}) => {
  const [depositStep, setDepositStep] = React.useState(DepositStep.DO);
  const { network } = useContractKit();
  const { poofAccount, actWithPoofAccount } = PoofAccountGlobal.useContainer();

  switch (depositStep) {
    case DepositStep.DO:
      return (
        <DoDeposit
          onDepositClick={async () => {
            try {
              if (poofAccount && backup) {
                actWithPoofAccount(
                  (privateKey) => {
                    deposit(privateKey).then(() =>
                      setDepositStep(DepositStep.RECEIPT)
                    );
                  },
                  () => {}
                );
              } else {
                await deposit();
                setDepositStep(DepositStep.RECEIPT);
              }
            } catch (e) {
              console.error("Failed to deposit", e);
              alert(e);
            }
          }}
          selectedAmount={selectedAmount}
          setSelectedAmount={setSelectedAmount}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          noteStringCommitment={noteStringCommitment}
          depositLoading={depositLoading}
          poofRate={poofRate}
          apRate={apRate}
          backup={backup}
          setBackup={setBackup}
        />
      );
    case DepositStep.RECEIPT:
      return (
        <DepositReceipt
          onDoneClick={() => {
            setNoteStringCommitment(
              getNoteStringAndCommitment(
                selectedCurrency,
                selectedAmount,
                network.chainId
              )
            );
            setDepositStep(DepositStep.DO);
          }}
          selectedAmount={selectedAmount}
          selectedCurrency={selectedCurrency}
          txHash={txHash}
        />
      );
  }
};

export default DesktopDepositPage;
