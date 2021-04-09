import React from "react";
import { isValidNote, parseNote } from "utils/snarks-functions";
import { Button, Flex, Input, Text } from "theme-ui";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";

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
  const breakpoint = useBreakpoint();

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

  return (
    <div>
      <Text variant="form" sx={{ mb: 2 }}>
        Magic password
      </Text>
      <Input
        name="note"
        type="text"
        value={note}
        placeholder="Enter note here"
        onChange={handleChange}
      />
      <Text variant="form" sx={{ mt: 4, mb: 2 }}>
        Recipient address
      </Text>
      <Input
        name="recipientAddress"
        type="text"
        value={recipient}
        onChange={handleChange}
        placeholder="Enter wallet address here"
      />
      {breakpoint === Breakpoint.MOBILE && (
        <BottomDrawer>
          <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
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
      )}
    </div>
  );
};
