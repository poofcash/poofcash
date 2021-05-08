import React from "react";
import Modal from "react-modal";
import { SelectWallet } from "pages/ConnectWallet/SelectWallet";
import { SelectIndex } from "pages/ConnectWallet/SelectIndex";

interface IProps {
  isOpen: boolean;
  goBack: () => void;
}

enum Mode {
  SELECT_WALLET = "SELECT_WALLET",
  SELECT_INDEX = "SELECT_INDEX",
}

export const ConnectWallet: React.FC<IProps> = ({ isOpen, goBack }) => {
  const [mode, setMode] = React.useState(Mode.SELECT_WALLET);

  let content;
  if (mode === Mode.SELECT_WALLET) {
    content = (
      <SelectWallet
        goBack={goBack}
        selectIndex={() => setMode(Mode.SELECT_INDEX)}
      />
    );
  } else if (mode === Mode.SELECT_INDEX) {
    content = (
      <SelectIndex goBack={() => setMode(Mode.SELECT_WALLET)} onDone={goBack} />
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={goBack}
      style={{ content: { top: 0, left: 0, width: "100%", height: "100%" } }}
    >
      {content}
    </Modal>
  );
};
