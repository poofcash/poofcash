import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "state";
import Web3 from "web3";
import Modal from "react-modal";
import { Text, Button, Flex, Input, Container } from "theme-ui";
import { createContainer } from "unstated-next";
import { setAccount } from "state/user";
import { Breakpoint, useBreakpoint } from "./breakpoint";

const web3 = new Web3();

const usePasswordPrompt = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [action, setAction] = React.useState<(password: string) => void>();
  const [cancelAction, setCancelAction] = React.useState<() => void>();
  const [subtitle, setSubtitle] = React.useState("");
  const breakpoint = useBreakpoint();

  const reset = () => {
    setIsOpen(false);
    setPassword("");
    setAction(undefined);
    setCancelAction(undefined);
    setSubtitle("");
  };

  let modalStyle: any = {
    content: { top: "25%", left: "25%", width: "50%", height: "50%" },
  };
  if (breakpoint === Breakpoint.MOBILE) {
    modalStyle = {
      content: { top: 0, left: 0, width: "100%", height: "100%" },
    };
  }

  const passwordModal = (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      style={modalStyle}
    >
      <Container pt={["66%", 0]}>
        <form
          onSubmit={(e) => {
            if (action) {
              action(password);
            }
            reset();
            e.preventDefault();
          }}
        >
          <Text variant="title" sx={{ mb: 2 }}>
            Enter account password
          </Text>
          <Text variant="regularGray" sx={{ mb: 2 }}>
            {subtitle}
          </Text>
          <Input
            sx={{ mb: 2 }}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <Flex sx={{ justifyContent: "flex-end" }}>
            <Button
              type="button"
              sx={{ mr: 4 }}
              onClick={() => {
                if (cancelAction) {
                  cancelAction();
                }
                reset();
              }}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button type="submit">Enter</Button>
          </Flex>
        </form>
      </Container>
    </Modal>
  );

  const promptPassword = (
    action: (password: string) => void,
    cancelAction: () => void,
    subtitle: string
  ) => {
    setIsOpen(true);
    // Have to wrap lambdas in an anon function to avoid React from invoking
    setAction(() => action);
    setCancelAction(() => cancelAction);
    setSubtitle(subtitle);
  };

  return { passwordModal, promptPassword };
};

export const PasswordPrompt = createContainer(usePasswordPrompt);

export const usePoofAccount = () => {
  const poofAccount = useSelector((state: AppState) => state.user.poofAccount);
  const { promptPassword } = PasswordPrompt.useContainer();
  const dispatch = useDispatch();

  const actWithPoofAccount = (
    action: (privateKey: string) => void,
    cancelAction: () => void
  ) => {
    if (!poofAccount) {
      return;
    }
    promptPassword(
      (password: string) => {
        try {
          const decryptedPoofAccount = web3.eth.accounts.decrypt(
            poofAccount,
            password
          );
          action(decryptedPoofAccount.privateKey.slice(2));
        } catch (e) {
          console.error(e);
          alert("Failed to decrypt account. Is your password correct?");
          cancelAction();
        }
      },
      cancelAction,
      "Enter your password to decrypt and retrieve your saved private key from local storage."
    );
  };

  const savePoofAccount = (privateKey: string, onSave: () => void) => {
    promptPassword(
      (password: string) => {
        dispatch(
          setAccount({
            poofAccount: web3.eth.accounts.encrypt(privateKey, password),
          })
        );
        onSave();
      },
      () => {},
      "Enter a password to encrypt and save your private key to local storage."
    );
  };

  return { poofAccount, actWithPoofAccount, savePoofAccount };
};
