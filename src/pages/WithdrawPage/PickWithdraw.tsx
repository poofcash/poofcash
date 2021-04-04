import React from "react";
import { isValidNote, parseNote } from "utils/snarks-functions";
import { Button, Flex, Input, Text } from "theme-ui";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";

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
  const { amount, currency } = parseNote(note);

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
      <BottomDrawer>
        <Flex sx={{ justifyContent: "space-between" }}>
          <LabelWithBalance
            label="Total"
            amount={isValidNote(note) ? amount : ""}
            currency={isValidNote(note) ? currency.toUpperCase() : "CELO"}
          />
          <Button
            variant="secondary"
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
      </BottomDrawer>
    </div>
  );
};
