import React from "react";
import { PickDeposit } from "pages/DepositPage/MobileDepositPage/PickDeposit";
import { ConfirmDeposit } from "pages/DepositPage/MobileDepositPage/ConfirmDeposit";
import { DepositReceipt } from "pages/DepositPage/MobileDepositPage/DepositReceipt";
import { IDepositProps } from "pages/DepositPage";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { useRecoilState } from "recoil";
import { depositBackup } from "../state";

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
  setAmount,
  amount,
  setCurrency,
  currency,
  notes,
  resetNotes,
  usingCustom,
  setUsingCustom,
  actualAmount,
  txHash,
  deposit,
  depositLoading,
}) => {
  const [depositStep, setDepositStep] = React.useState(DepositStep.PICKER);
  const { poofAccount, actWithPoofAccount } = PoofAccountGlobal.useContainer();
  const [backup] = useRecoilState(depositBackup);

  switch (depositStep) {
    case DepositStep.PICKER:
      return (
        <PickDeposit
          onDepositClick={() => {
            setDepositStep(DepositStep.CONFIRM);
          }}
          amount={amount}
          setAmount={setAmount}
          currency={currency}
          setCurrency={setCurrency}
          setUsingCustom={setUsingCustom}
          usingCustom={usingCustom}
          actualAmount={actualAmount}
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
          amount={actualAmount}
          currency={currency}
          notes={notes}
          depositLoading={depositLoading}
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
          amount={usingCustom ? actualAmount : amount}
          currency={currency}
          txHash={txHash}
        />
      );
  }
};

export default MobileDepositPage;
