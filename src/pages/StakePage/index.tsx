import React from "react";
import { DoStake } from "./DoStake";

enum StakeStep {
  DO = "DO",
}

const StakePage: React.FC = () => {
  const [step] = React.useState(StakeStep.DO);
  const [amount, setAmount] = React.useState("0");

  switch (step) {
    case StakeStep.DO:
      return <DoStake amount={amount} setAmount={setAmount} />;
  }
};

export default StakePage;
