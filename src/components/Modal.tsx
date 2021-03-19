import React from "react";
import styled from "@emotion/styled";
import Backdrop from "components/Backdrop";
import { CloseButton } from "./Button";

interface IProps {
  modalClosed: any;
  show: boolean;
}

const StyledModal = styled.div<{ show: boolean }>(({ show }) => ({
  position: "fixed",
  zIndex: 500,
  backgroundColor: "white",
  maxWidth: "620px",
  width: "80%",
  textAlign: "left",
  padding: "30px 30px",
  left: "calc(50% - 310px)",
  top: "20%",
  borderRadius: "6px",
  boxSizing: "border-box",
  transition: "all 0.3s ease-out",
  overflow: "hidden",
  maxHeight: "90vh",
  border: "5px solid #263238",
  transform: show ? "translateY(0)" : "translateY(-100vh)",
  opacity: show ? "1" : "0",
}));

const Modal: React.FC<IProps> = ({ modalClosed, show, children }) => {
  return (
    <>
      {show && <Backdrop onClick={modalClosed} />}
      <StyledModal show={show}>
        <CloseButton onClick={modalClosed} />
        {children}
      </StyledModal>
    </>
  );
};

export default Modal;
