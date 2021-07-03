import React from "react";
import { IconButton } from "theme-ui";
import { ArrowLeft } from "react-feather";

interface IProps {
  onClick: () => void;
}

export const BackButton: React.FC<IProps> = ({ onClick }) => {
  return (
    <IconButton
      sx={{ cursor: "pointer", mb: 3, ml: "-6px", color: "text" }}
      aria-label="Go back"
      onClick={onClick}
    >
      <ArrowLeft />
    </IconButton>
  );
};
