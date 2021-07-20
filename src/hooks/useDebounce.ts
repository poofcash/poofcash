import { useCallback, useState } from "react";

export const useDebounce = (callback: (...v: any[]) => any, delay: number) => {
  const [timeoutFn, setTimeoutFn] = useState<any>();

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutFn) {
        clearTimeout(timeoutFn);
      }
      setTimeoutFn(setTimeout(() => callback(...args), delay));
    },
    [callback, delay, timeoutFn]
  );

  return debouncedCallback;
};
