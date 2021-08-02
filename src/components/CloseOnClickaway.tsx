import React from "react";

interface Props {
  onClickaway: (e: any) => any;
}

export const CloseOnClickaway: React.FC<Props> = ({
  children,
  onClickaway,
}) => {
  const node = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handleClick = (e: any) => {
      if (node?.current?.contains(e.target)) {
        return;
      }
      onClickaway(e);
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClickaway]);

  return <div ref={node}>{children}</div>;
};
