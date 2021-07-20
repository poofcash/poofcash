import React from "react";
import { PickDeposit } from "pages/DepositPage/MobileDepositPage/PickDeposit";
import { ConfirmDeposit } from "pages/DepositPage/MobileDepositPage/ConfirmDeposit";
import { DepositReceipt } from "pages/DepositPage/MobileDepositPage/DepositReceipt";
import { IDepositProps } from "pages/DepositPage";
import { PoofAccountGlobal } from "hooks/poofAccount";

enum DepositStep {
  PICKER = "PICKER",
  CONFIRM = "CONFIRM",
  RECEIPT = "RECEIPT",
}

export const initialNoteStringCommitment = {
  noteString: "",
  commitment: "",
};

// pass props and State interface to Component class
const MobileDepositPage: React.FC<IDepositProps> = ({
  setSelectedAmount,
  selectedAmount,
  setSelectedCurrency,
  selectedCurrency,
  notes,
  resetNotes,
  usingCustom,
  setUsingCustom,
  customAmount,
  setCustomAmount,
  txHash,
  deposit,
  depositLoading,
  poofRate,
  apRate,
  backup,
  setBackup,
}) => {
  const [depositStep, setDepositStep] = React.useState(DepositStep.PICKER);
  const { poofAccount, actWithPoofAccount } = PoofAccountGlobal.useContainer();

  switch (depositStep) {
    case DepositStep.PICKER:
      return (
        <PickDeposit
          onDepositClick={() => {
            setDepositStep(DepositStep.CONFIRM);
          }}
          selectedAmount={selectedAmount}
          setSelectedAmount={setSelectedAmount}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          setUsingCustom={setUsingCustom}
          usingCustom={usingCustom}
          setCustomAmount={setCustomAmount}
          customAmount={customAmount}
          poofRate={poofRate}
          apRate={apRate}
        />
      );
    case DepositStep.CONFIRM:
      return (
        <ConfirmDeposit
          onBackClick={() => setDepositStep(DepositStep.PICKER)}
          onConfirmClick={async () => {
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
          amount={usingCustom ? customAmount : selectedAmount}
          selectedCurrency={selectedCurrency}
          notes={notes}
          depositLoading={depositLoading}
          backup={backup}
          setBackup={setBackup}
        />
      );
    case DepositStep.RECEIPT:
      return (
        <DepositReceipt
          onDoneClick={() => {
            // Generate a new note
            resetNotes();
            setDepositStep(DepositStep.PICKER);
          }}
          amount={usingCustom ? customAmount : selectedAmount}
          selectedCurrency={selectedCurrency}
          txHash={txHash}
        />
      );
  }
};

export default MobileDepositPage;
