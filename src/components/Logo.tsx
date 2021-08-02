import React from "react";
import { Link } from "react-router-dom";
import { LogoIcon } from "icons/LogoIcon";

export const Logo: React.FC = () => {
  return (
    <Link to="/" style={{ textDecoration: "none", color: "black" }}>
      <LogoIcon size={50} />
    </Link>
  );
};
