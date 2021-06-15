import React from "react";
import { Logo } from "components/Logo";
import { Button, Link } from "theme-ui";

interface IProps {
  goCreate: () => void;
  goLogin: () => void;
  goGuest: () => void;
}

export const SelectLogin: React.FC<IProps> = ({
  goCreate,
  goLogin,
  goGuest,
}) => {
  return (
    <>
      <Logo />
      <Button variant="primary" mt={4} onClick={goCreate}>
        Create a Poof account
      </Button>
      <Button variant="secondary" mt={2} onClick={goLogin}>
        Log in
      </Button>
      <Link sx={{ cursor: "pointer" }} mt={6} onClick={goGuest}>
        Continue as guest
      </Link>
    </>
  );
};
