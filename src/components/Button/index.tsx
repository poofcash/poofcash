import styled from "@emotion/styled";

export const Button = styled.button({
  margin: "1em auto",
  ":focus": {
    outline: 0,
  },
});

export const CloseButton = styled.button({
  position: "absolute",
  right: "10px",
  top: "5px",
  border: "none",
  color: "#263238",
  backgroundColor: "rgba(0, 0, 0, 0)",
  fontWeight: "bold",
  fontSize: "20px",
  cursor: "pointer",
  padding: "6px 11px",
  borderRadius: "30px",
  transition: "0.2s",
  marginTop: "5px",
  ":hover": {
    backgroundColor: "#eceff1",
  },
});
