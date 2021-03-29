import React from "react";
import moment from "moment";
import { isValidNote, parseNote, toHex } from "utils/snarks-functions";
import { Container, Input, Label, Text } from "theme-ui";
import { useTornadoDeposits } from "hooks/readContract";
import { CHAIN_ID } from "config";
import { instances } from "poof-token";

type NoteDetail = {
  commitment: string;
};

const CompliancePage = () => {
  const [note, setNote] = React.useState("");
  const [noteDetail, setNoteDetail] = React.useState<NoteDetail>({
    commitment: "",
  });
  const [tornadoAddress, setTornadoAddress] = React.useState();
  // Used in the txn filters
  const [depositArgs, setDepositArgs] = React.useState<Array<string>>();
  const deposits = useTornadoDeposits(tornadoAddress, depositArgs);
  console.log("Deposits", deposits);

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

  React.useEffect(() => {
    console.log("Note", note);
    if (noteIsValid) {
      const { deposit, currency, amount } = parseNote(note);
      const commitmentHex = toHex(deposit.commitment);
      setNoteDetail({ commitment: commitmentHex });
      console.log(deposit, currency, amount);
      setTornadoAddress(
        instances[`netId${CHAIN_ID}`][currency].instanceAddress[amount]
      );
      setDepositArgs([commitmentHex]);
    }
  }, [note, noteIsValid]);

  /**
   * Do a CELO withdrawal
   */
  return (
    <div>
      <Text>
        Maintaining financial privacy is essential to preserving our freedoms.
        However, it should not come at the cost of non-compliance. With
        Poof.cash, you can always provide cryptographically verified proof of
        transactional history using the Celo address you used to deposit or
        withdraw funds. This might be necessary to show the origin of assets
        held in your withdrawal address. To generate a compliance report, please
        enter your Poof.cash Note below.
      </Text>
      <Label htmlFor="note">Note</Label>
      <Input name="note" type="text" value={note} onChange={handleChange} />
      {note && !noteIsValid && <Text>Note is invalid.</Text>}
      <br />
      {note && noteIsValid && deposits.length !== 1 && (
        <Text>Note is valid, but {deposits.length} deposits found</Text>
      )}
      {note && noteIsValid && deposits.length === 1 && (
        <Container sx={{ textAlign: "left", width: "100%" }}>
          <h3>Deposit details</h3>
          <Text>
            <strong>Date</strong>:{" "}
            {moment(deposits[0].timestamp * 1000).format(
              "MMMM Do YYYY, h:mm:ss a"
            )}
          </Text>
          <Text>
            <strong>Transaction</strong>: {deposits[0].transactions[0]?.hash}
          </Text>
          <Text>
            <strong>From</strong>: {deposits[0].transactions[0]?.from}
          </Text>
          <Text>
            <strong>Commitment</strong>: {noteDetail.commitment.toString()}
          </Text>
        </Container>
      )}
    </div>
  );
};

export default CompliancePage;
