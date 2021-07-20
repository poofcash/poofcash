import React from "react";
import { DoDeposit } from "pages/DepositPage/DesktopDepositPage/DoDeposit";
import { DepositReceipt } from "pages/DepositPage/DesktopDepositPage/DepositReceipt";
import { IDepositProps } from "pages/DepositPage";
import { PoofAccountGlobal } from "hooks/poofAccount";

enum DepositStep {
  DO = "DO",
  RECEIPT = "RECEIPT",
}

const DesktopDepositPage: React.FC<IDepositProps> = ({
  setSelectedAmount,
  selectedAmount,
  setSelectedCurrency,
  selectedCurrency,
  notes,
  resetNotes,
  usingCustom,
  setUsingCustom,
  customAmount,
  actualAmount,
  setCustomAmount,
  txHash,
  deposit,
  depositLoading,
  poofRate,
  apRate,
  backup,
  setBackup,
}) => {
  const [depositStep, setDepositStep] = React.useState(DepositStep.DO);
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
          setUsingCustom={setUsingCustom}
          usingCustom={usingCustom}
          setCustomAmount={setCustomAmount}
          customAmount={customAmount}
          actualAmount={actualAmount}
          notes={notes}
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
            resetNotes();
            setDepositStep(DepositStep.DO);
          }}
          amount={actualAmount}
          selectedCurrency={selectedCurrency}
          txHash={txHash}
        />
      );
  }
};

export default DesktopDepositPage;
