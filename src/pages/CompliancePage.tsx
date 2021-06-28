import React from "react";
import { isValidNote, parseNote, toHex } from "utils/snarks-functions";
import { Container, Input, Text } from "theme-ui";
import { BlockscoutTxLink } from "components/Links";
import { PoofKitGlobal } from "hooks/poofUtils";
import { EventData } from "web3-eth-contract";

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
  const { poofKit } = PoofKitGlobal.useContainer();
  const [depositBlock, setDepositBlock] = React.useState<EventData>();
  const [withdrawBlock, setWithdrawBlock] = React.useState<EventData>();

  React.useEffect(() => {
    if (isValidNote(note)) {
      const { deposit } = parseNote(note);
      setNoteDetail({
        commitment: toHex(deposit.commitment),
        nullifierHash: toHex(deposit.nullifierHash),
      });

      poofKit.noteInfo(note).then(({ depositBlock, withdrawBlock }) => {
        setDepositBlock(depositBlock);
        setWithdrawBlock(withdrawBlock);
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

  const noteIsValid = isValidNote(note);

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
      />
      {note && !noteIsValid && <Text>Note is invalid.</Text>}
      <br />
      {note && noteIsValid && (
        <Container sx={{ textAlign: "left", width: "100%" }}>
          <h3>Deposit details</h3>
          {depositBlock ? (
            <>
              <Text>
                <strong>Transaction</strong>:{" "}
                <BlockscoutTxLink tx={depositBlock.transactionHash}>
                  {depositBlock.transactionHash}
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
          {withdrawBlock ? (
            <>
              <Text>
                <strong>Transaction</strong>:{" "}
                <BlockscoutTxLink tx={withdrawBlock.transactionHash}>
                  {withdrawBlock.transactionHash}
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
        </Container>
      )}
    </div>
  );
};

export default CompliancePage;
