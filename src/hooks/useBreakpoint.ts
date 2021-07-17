import { useLayoutEffect, useState } from "react";
import { useThemeUI } from "theme-ui";

export enum Breakpoint {
  MOBILE = "MOBILE",
  DESKTOP = "DESKTOP",
}

export const useBreakpoint = () => {
  const { theme } = useThemeUI();
  const [breakpoint, setBreakpoint] = useState(Breakpoint.MOBILE);
  const desktopBreakpoint = parseInt(theme.breakpoints![1] as string);

  useLayoutEffect(() => {
    const listener = () => {
      if (window.innerWidth < desktopBreakpoint) {
        setBreakpoint(Breakpoint.MOBILE);
      } else {
        setBreakpoint(Breakpoint.DESKTOP);
      }
    };
    window.addEventListener("resize", listener);
    listener();
    return () => window.removeEventListener("resize", listener);
  }, [desktopBreakpoint]);
  return breakpoint;
};
