import React from "react";
import { SelectLogin } from "pages/SetupAccount/SelectLogin";
import { CreateAccount } from "pages/SetupAccount/CreateAccount";
import { Flex } from "theme-ui";

enum SetupStep {
  SELECT_LOGIN = "SELECT_LOGIN",
  CREATE = "CREATE",
}
export const SetupAccount: React.FC = () => {
  const [step, setStep] = React.useState(SetupStep.SELECT_LOGIN);
  let page = <SelectLogin goCreate={() => setStep(SetupStep.CREATE)} />;
  switch (step) {
    case SetupStep.CREATE:
      page = <CreateAccount goBack={() => setStep(SetupStep.SELECT_LOGIN)} />;
      break;
  }

  return <Flex sx={{ flexDirection: "column", mt: ["25%"] }}>{page}</Flex>;
};
