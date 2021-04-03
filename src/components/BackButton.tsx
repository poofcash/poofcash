import React from "react";
import { IconButton } from "theme-ui";
import { ArrowLeftIcon } from "icons/ArrowLeftIcon";

interface IProps {
  onClick: () => void;
}

export const BackButton: React.FC<IProps> = ({ onClick }) => {
  return (
    <IconButton
      sx={{ mb: 3, ml: "-6px" }}
      aria-label="Go back"
      onClick={onClick}
    >
      <ArrowLeftIcon />
    </IconButton>
  );
};
