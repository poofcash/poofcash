import { BLOCKSCOUT_URL } from "config";
import React from "react";
import { Link } from "theme-ui";

export const BlockscoutTxLink: React.FC<{ tx: string }> = ({
  tx,
  children,
}) => {
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={`${BLOCKSCOUT_URL}/tx/${tx}`}
      style={{ textDecoration: "none" }}
    >
      {children}
    </Link>
  );
};

export const BlockscoutAddressLink: React.FC<{
  address: string;
}> = ({ address, children }) => {
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={`${BLOCKSCOUT_URL}/address/${address}`}
      style={{ textDecoration: "none" }}
    >
      {children}
    </Link>
  );
};
