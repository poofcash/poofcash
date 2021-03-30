import React from "react";
import moment from "moment";
import { isValidNote, parseNote, toHex } from "utils/snarks-functions";
import { Container, Input, Label, Text } from "theme-ui";
import { useTornadoDeposits, useTornadoWithdraws } from "hooks/readContract";
import { CHAIN_ID } from "config";
import { instances } from "poof-token";
import { BlockscoutAddressLink, BlockscoutTxLink } from "components/Links";

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
  const [tornadoAddress, setTornadoAddress] = React.useState();
  // Used in the txn filters
  const deposits = useTornadoDeposits(tornadoAddress, noteDetail.commitment);
  const [withdrawBlocks, withdrawEvents] = useTornadoWithdraws(
    tornadoAddress,
    noteDetail.nullifierHash
  );

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
    if (noteIsValid) {
      const { deposit, currency, amount } = parseNote(note);
      setNoteDetail({
        commitment: toHex(deposit.commitment),
        nullifierHash: toHex(deposit.nullifierHash),
      });
      setTornadoAddress(
        instances[`netId${CHAIN_ID}`][currency].instanceAddress[amount]
      );
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
      {note && noteIsValid && (
        <Container sx={{ textAlign: "left", width: "100%" }}>
          <h3>Deposit details</h3>
          {deposits.length === 1 ? (
            <>
              <Text>
                <strong>Date</strong>:{" "}
                {moment(deposits[0].timestamp * 1000).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}
              </Text>
              <Text>
                <strong>Transaction</strong>:{" "}
                <BlockscoutTxLink tx={deposits[0].transactions[0]?.hash}>
                  {deposits[0].transactions[0]?.hash}
                </BlockscoutTxLink>
              </Text>
              <Text>
                <strong>From</strong>:{" "}
                <BlockscoutAddressLink
                  address={deposits[0].transactions[0]?.from}
                >
                  {deposits[0].transactions[0]?.from}
                </BlockscoutAddressLink>
              </Text>
              <Text>
                <strong>Commitment</strong>: {noteDetail.commitment?.toString()}
              </Text>
            </>
          ) : (
            <Text>Note is valid, but {deposits.length} deposits found.</Text>
          )}
          <h3>Withdraw details</h3>
          {withdrawBlocks.length === 1 && withdrawEvents.length === 1 ? (
            <>
              <Text>
                <strong>Date</strong>:{" "}
                {moment(withdrawBlocks[0].timestamp * 1000).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}
              </Text>
              <Text>
                <strong>Transaction</strong>:{" "}
                <BlockscoutTxLink tx={withdrawBlocks[0].transactions[1]?.hash}>
                  {withdrawBlocks[0].transactions[1]?.hash}
                </BlockscoutTxLink>
              </Text>
              <Text>
                <strong>To</strong>:{" "}
                <BlockscoutAddressLink address={withdrawEvents[0].args[0]}>
                  {withdrawEvents[0].args[0]}
                </BlockscoutAddressLink>
              </Text>
              <Text>
                <strong>Nullifier hash</strong>:{" "}
                {noteDetail.nullifierHash?.toString()}
              </Text>
            </>
          ) : (
            <Text>
              Note is valid, but {withdrawBlocks.length} withdraw blocks and{" "}
              {withdrawEvents.length} withdraw events found.
            </Text>
          )}
        </Container>
      )}
    </div>
  );
};

export default CompliancePage;
