import { ChainId, useContractKit } from "@celo-tools/use-contractkit";
import React from "react";
import Modal from "components/Modal";

interface IProps {
  neededAmount: string;
  onClose: () => void;
  show: boolean;
}

export const InsufficientBalanceModal: React.FC<IProps> = ({
  neededAmount,
  onClose,
  show,
}) => {
  const { network } = useContractKit();
  return (
    <Modal modalClosed={onClose} show={show}>
      <h2>Insufficient balance</h2>
      <p>You don't have enough CELO tokens. You need {neededAmount} CELO.</p>
      {network.chainId === ChainId.Alfajores && (
        <p>
          You can get more CELO{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://celo.org/developers/faucet"
          >
            here
          </a>
          .
        </p>
      )}
    </Modal>
  );
};
