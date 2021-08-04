import React from "react";
import { MobileLogin } from "pages/SetupAccount/Login/MobileLogin";
import { DesktopLogin } from "pages/SetupAccount/Login/DesktopLogin";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";

export const Login: React.FC = () => {
  const breakpoint = useBreakpoint();

  if (breakpoint === Breakpoint.MOBILE) {
    return <MobileLogin />;
  }

  return <DesktopLogin />;
};
