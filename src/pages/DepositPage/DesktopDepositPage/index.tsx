import React from "react";
import { DoDeposit } from "pages/DepositPage/DesktopDepositPage/DoDeposit";
import { DepositReceipt } from "pages/DepositPage/DesktopDepositPage/DepositReceipt";
import { IDepositProps } from "pages/DepositPage";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { useRecoilState } from "recoil";
import { depositBackup } from "../state";

enum DepositStep {
  DO = "DO",
  RECEIPT = "RECEIPT",
}

const DesktopDepositPage: React.FC<IDepositProps> = ({
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
  const [depositStep, setDepositStep] = React.useState(DepositStep.DO);
  const { poofAccount, actWithPoofAccount } = PoofAccountGlobal.useContainer();
  const [backup] = useRecoilState(depositBackup);

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
          amount={amount}
          setAmount={setAmount}
          currency={currency}
          setCurrency={setCurrency}
          setUsingCustom={setUsingCustom}
          usingCustom={usingCustom}
          actualAmount={actualAmount}
          notes={notes}
          depositLoading={depositLoading}
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
          currency={currency}
          txHash={txHash}
        />
      );
  }
};

export default DesktopDepositPage;
