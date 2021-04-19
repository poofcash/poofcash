import React from "react";
import { isValidNote, parseNote } from "utils/snarks-functions";
import { Button, Flex, Input, Text } from "theme-ui";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";
import web3 from "web3";
import { useDebounce } from "hooks/debounce";

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

  const handleChange = React.useCallback(
    (event: any) => {
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
    },
    [setNote, setRecipient]
  );

  const debouncedHandleChange = useDebounce(handleChange, 200);

  return (
    <div>
      <Text variant="form" sx={{ mb: 2 }}>
        Magic password
      </Text>
      <Input
        name="note"
        type="text"
        placeholder="Enter note here"
        onChange={debouncedHandleChange}
        pattern="/poof-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g"
      />
      {note !== "" && !isValidNote(note) && (
        <Text sx={{ mt: 2, color: "red" }} variant="form">
          Invalid note, please try again.
        </Text>
      )}
      <Text variant="form" sx={{ mt: 4, mb: 2 }}>
        Recipient address
      </Text>
      <Input
        name="recipientAddress"
        type="text"
        onChange={debouncedHandleChange}
        placeholder="Enter wallet address here"
      />
      {recipient !== "" && !web3.utils.isAddress(recipient) && (
        <Text sx={{ mt: 2, color: "red" }} variant="form">
          Invalid address, please try again.
        </Text>
      )}
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
