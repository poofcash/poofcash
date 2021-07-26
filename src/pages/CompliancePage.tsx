import React from "react";
import { isValidNote, parseNote, toHex } from "utils/snarks-functions";
import { Container, Input, Text } from "theme-ui";
import { BlockscoutTxLink } from "components/Links";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { Note } from "@poofcash/poof-kit";
import { usePoofEvents } from "hooks/usePoofEvents";
import { useAsyncState } from "hooks/useAsyncState";

type NoteDetail = {
  commitment?: string;
  nullifierHash?: string;
};

const CompliancePage = () => {
  const [note, setNote] = React.useState("");
  const [noteDetail, setNoteDetail] = React.useState<NoteDetail>({
    commitment: "",
    nullifierHash: "",
  });
  const [depositEvents] = usePoofEvents("Deposit");
  const [withdrawEvents] = usePoofEvents("Withdrawal");
  const noteIsValid = isValidNote(note);
  let noteObject: Note | null = null;
  if (noteIsValid) {
    const poofAddress = Note.getInstance(note);
    noteObject = Note.fromString(
      note,
      depositEvents[poofAddress] || [],
      withdrawEvents[poofAddress] || []
    );
  }
  const { poofKit } = PoofKitGlobal.useContainer();
  const isMinedCall = React.useCallback(async () => {
    if (!noteObject) {
      return "Unknown";
    }
    const isMined = await poofKit.isMined(toHex(noteObject.rewardNullifier));
    if (isMined) {
      return "true";
    }
    return "false";
  }, [poofKit, noteObject]);
  const [isMined] = useAsyncState("Unknown", isMinedCall);

  React.useEffect(() => {
    if (isValidNote(note)) {
      const { deposit } = parseNote(note);
      setNoteDetail({
        commitment: toHex(deposit.commitment),
        nullifierHash: toHex(deposit.nullifierHash),
      });
    }
  }, [poofKit, note]);

  const handleChange = (event: any) => {
    // Handle change of input fields
    switch (event.target.name) {
      case "note":
        setNote(event.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Text variant="title">Report</Text>
      <br />
      <Text sx={{ mb: 2 }} variant="regularGray">
        Enter your magic password to generate a report on its related deposit
        and withdrawal events.
      </Text>
      <br />
      <Text variant="form">Magic password</Text>
      <Input
        name="note"
        type="text"
        value={note}
        onChange={handleChange}
        placeholder="Enter magic password here"
        autoComplete="off"
      />
      {note && !noteIsValid && <Text>Note is invalid.</Text>}
      <br />
      {noteObject && (
        <Container sx={{ textAlign: "left", width: "100%" }}>
          <h3>Deposit details</h3>
          {noteObject?.depositBlock ? (
            <>
              <Text>
                <strong>Transaction</strong>:{" "}
                <BlockscoutTxLink tx={noteObject.depositBlock.transactionHash}>
                  {noteObject.depositBlock.transactionHash}
                </BlockscoutTxLink>
              </Text>
              <br />
              <Text>
                <strong>Commitment</strong>: {noteDetail.commitment?.toString()}
              </Text>
            </>
          ) : (
            <Text>Note is valid, but no deposit event was found.</Text>
          )}
          <h3>Withdraw details</h3>
          {noteObject?.withdrawalBlock ? (
            <>
              <Text>
                <strong>Transaction</strong>:{" "}
                <BlockscoutTxLink
                  tx={noteObject.withdrawalBlock.transactionHash}
                >
                  {noteObject.withdrawalBlock.transactionHash}
                </BlockscoutTxLink>
              </Text>
              <br />
              <Text>
                <strong>Nullifier hash</strong>:{" "}
                {noteDetail.nullifierHash?.toString()}
              </Text>
            </>
          ) : (
            <Text>Note is valid, but no withdraw event was found.</Text>
          )}
          <h3>Mine details</h3>
          {noteObject?.withdrawalBlock ? (
            <>
              <Text>
                <strong>Mined</strong>: {isMined}
              </Text>
              <br />
              <Text>
                <strong>Reward nullifier hash</strong>:{" "}
                {toHex(noteObject.rewardNullifier)}
              </Text>
            </>
          ) : (
            <Text>Note is valid, but no withdraw event was found.</Text>
          )}
        </Container>
      )}
    </div>
  );
};

export default CompliancePage;
