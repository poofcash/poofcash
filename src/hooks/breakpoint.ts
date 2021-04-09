import { useLayoutEffect, useState } from "react";
import { useThemeUI } from "theme-ui";

export enum Breakpoint {
  MOBILE = "MOBILE",
  DESKTOP = "DESKTOP",
}

export const useBreakpoint = () => {
  const { theme } = useThemeUI();
  const [breakpoint, setBreakpoint] = useState(Breakpoint.MOBILE);

  useLayoutEffect(() => {
    const desktopBreakpoint = parseInt(theme.breakpoints![1] as string);
    if (window.screen.width < desktopBreakpoint) {
      setBreakpoint(Breakpoint.MOBILE);
    } else {
      setBreakpoint(Breakpoint.DESKTOP);
    }
  }, [theme.breakpoints]);
  return breakpoint;
};
