import React from "react";
import styled from "@emotion/styled";
import Backdrop from "components/Backdrop";

interface IProps {
  modalClosed: any;
  show: boolean;
}

const StyledModal = styled.div<{ show: boolean }>(({ show }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  zIndex: 500,
  backgroundColor: "white",
  textAlign: "center",
  padding: "32px 32px",
  borderRadius: "4px",
  boxSizing: "border-box",
  transition: "all 0.3s ease-out",
  overflow: "hidden",
  border: "2px solid #263238",
  transform: "translate(-50%, -50%)",
  display: show ? "block" : "none",
  width: "64%",
}));

const Modal: React.FC<IProps> = ({ modalClosed, show, children }) => {
  return (
    <>
      {show && <Backdrop onClick={modalClosed} />}
      <StyledModal show={show}>{children}</StyledModal>
    </>
  );
};

export default Modal;
