import React from "react";
import { SelectLogin } from "pages/SetupAccount/SelectLogin";
import { useDispatch } from "react-redux";
import { Page, setCurrentPage } from "state/global";
import { CreateAccount } from "pages/SetupAccount/CreateAccount";
import { Login } from "pages/SetupAccount/Login";
import { Flex } from "theme-ui";

enum SetupStep {
  SELECT_LOGIN = "SELECT_LOGIN",
  CREATE = "CREATE",
  LOGIN = "LOGIN",
}
export const SetupAccount: React.FC = () => {
  const [step, setStep] = React.useState(SetupStep.SELECT_LOGIN);
  const dispatch = useDispatch();

  let page = (
    <SelectLogin
      goCreate={() => setStep(SetupStep.CREATE)}
      goLogin={() => setStep(SetupStep.LOGIN)}
      goGuest={() => dispatch(setCurrentPage({ nextPage: Page.DEPOSIT }))}
    />
  );
  switch (step) {
    case SetupStep.CREATE:
      page = <CreateAccount goBack={() => setStep(SetupStep.SELECT_LOGIN)} />;
      break;
    case SetupStep.LOGIN:
      page = <Login goBack={() => setStep(SetupStep.SELECT_LOGIN)} />;
      break;
  }

  return (
    <Flex
      sx={{ flexDirection: "column", alignItems: "center", mt: ["66%", "25%"] }}
    >
      {page}
    </Flex>
  );
};
