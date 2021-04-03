import React from "react";
import { isValidNote } from "utils/snarks-functions";
import { Button, Flex, Input, Text } from "theme-ui";

interface IProps {
  onWithdrawClick: () => void;
  setNote: (note: string) => void;
  note: string;
  setRecipient: (recipient: string) => void;
  recipient: string;
}

export const PickWithdraw: React.FC<IProps> = ({
  onWithdrawClick,
  setNote,
  note,
  setRecipient,
  recipient,
}) => {
  const handleChange = (event: any) => {
    switch (event.target.name) {
      case "recipientAddress":
        setRecipient(event.target.value);
        break;
      case "note":
        setNote(event.target.value);
        break;
      default:
        break;
    }
  };

  /**
   * Do a CELO withdrawal
   */
  return (
    <div>
      <Text variant="form">Note</Text>
      <Input name="note" type="text" value={note} onChange={handleChange} />
      <br />
      <Text variant="form">Recipient address</Text>
      <Input
        name="recipientAddress"
        type="text"
        value={recipient}
        onChange={handleChange}
      />
      <div>
        <Flex sx={{ mt: 4, justifyContent: "flex-end" }}>
          <Button
            variant="primary"
            onClick={() => {
              if (!isValidNote(note)) {
                alert("Note is not valid");
                return;
              }
              onWithdrawClick();
            }}
            disabled={recipient === "" || note === ""}
          >
            Withdraw
          </Button>
        </Flex>
      </div>
    </div>
  );
};
