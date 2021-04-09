import React from "react";
import MobileDepositPage from "pages/DepositPage/MobileDepositPage";
import DesktopDepositPage from "pages/DepositPage/DesktopDepositPage";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";

const DepositPage: React.FC = () => {
  const breakpoint = useBreakpoint();

  if (breakpoint === Breakpoint.MOBILE) {
    return <MobileDepositPage />;
  }

  return <DesktopDepositPage />;
};

export default DepositPage;
