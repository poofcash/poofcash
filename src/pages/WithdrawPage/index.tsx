import React from "react";
import MobileWithdrawPage from "pages/WithdrawPage/MobileWithdrawPage";
import DesktopWithdrawPage from "pages/WithdrawPage/DesktopWithdrawPage";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";

const WithdrawPage: React.FC = () => {
  const breakpoint = useBreakpoint();

  if (breakpoint === Breakpoint.MOBILE) {
    return <MobileWithdrawPage />;
  }

  return <DesktopWithdrawPage />;
};

export default WithdrawPage;
