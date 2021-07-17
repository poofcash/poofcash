import React from "react";
import { MobileHeader } from "components/Header/MobileHeader";
import { DesktopHeader } from "components/Header/DesktopHeader";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";

export const Header: React.FC = () => {
  const breakpoint = useBreakpoint();

  if (breakpoint === Breakpoint.MOBILE) {
    return <MobileHeader />;
  }

  return <DesktopHeader />;
};
