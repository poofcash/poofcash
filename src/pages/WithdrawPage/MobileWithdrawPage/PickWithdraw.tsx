import React from "react";
import web3 from "web3";
import { isValidNote, parseNote } from "utils/snarks-functions";
import { Button, Flex, Input, Select, Text } from "theme-ui";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";
import { useDebounce } from "hooks/debounce";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";
import { isValidHttpUrl } from "utils/url.utils";
import axios from "axios";

interface IProps {
  onWithdrawClick: () => void;
  setNote: (note: string) => void;
  note: string;
  setRecipient: (recipient: string) => void;
  recipient: string;
  loading?: boolean;
  selectedRelayer?: RelayerOption;
  setSelectedRelayer: (relayer?: RelayerOption) => void;
  relayerOptions?: Array<RelayerOption>;
  usingCustomRelayer: boolean;
  setUsingCustomRelayer: (usingCustomRelayer: boolean) => void;
  customRelayer?: RelayerOption;
  setCustomRelayer: (relayerOption?: RelayerOption) => void;
}

export const PickWithdraw: React.FC<IProps> = ({
  onWithdrawClick,
  setNote,
  note,
  setRecipient,
  recipient,
  loading,
  selectedRelayer,
  setSelectedRelayer,
  relayerOptions,
  usingCustomRelayer,
  setUsingCustomRelayer,
  customRelayer,
  setCustomRelayer,
}) => {
  const breakpoint = useBreakpoint();
  const [customRelayerError, setCustomRelayerError] = React.useState<
    string | null
  >(null);

  const { amount, currency } = React.useMemo(() => parseNote(note), [note]);
  const validNote = React.useMemo(() => isValidNote(note), [note]);
  const validRecipient = React.useMemo(() => web3.utils.isAddress(recipient), [
    recipient,
  ]);

  const [customRelayerUrl, setCustomRelayerUrl] = React.useState("");
  const onCustomRelayerUrlChange = useDebounce((relayerUrl) => {
    if (isValidHttpUrl(relayerUrl)) {
      axios
        .get(relayerUrl + "/status")
        .then(({ data }) =>
          setCustomRelayer({
            url: relayerUrl,
            relayerFee: data.poofServiceFee,
          })
        )
        .catch((err) =>
          setCustomRelayerError(
            `${err.message}. Make sure you remove the "/" at the end of your url`
          )
        );
      setCustomRelayerError(null);
    } else if (relayerUrl !== "") {
      setCustomRelayerError("Invalid custom relayer url format");
    }
  }, 200);

  return (
    <div>
      <Text variant="form" sx={{ mb: 2 }}>
        Magic password
      </Text>
      <Input
        disabled={loading}
        name="note"
        type="text"
        placeholder="Enter note here"
        onChange={(e) => setNote(e.target.value)}
        value={note}
        pattern="/poof-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g"
      />
      {note !== "" && !validNote && (
        <Text sx={{ mt: 2, color: "red" }} variant="form">
          Invalid note, please try again.
        </Text>
      )}

      <Text variant="form" sx={{ mt: 4, mb: 2 }}>
        Recipient address
      </Text>
      <Input
        disabled={loading}
        name="recipientAddress"
        type="text"
        onChange={(e) => setRecipient(e.target.value)}
        value={recipient}
        placeholder="Enter wallet address here"
      />
      {recipient !== "" && !validRecipient && (
        <Text sx={{ mt: 2, color: "red" }} variant="form">
          Invalid address, please try again.
        </Text>
      )}

      <Text variant="form" sx={{ mt: 4, mb: 2 }}>
        Relayer
      </Text>
      <Select
        disabled={loading}
        name="relayer"
        value={usingCustomRelayer ? "custom" : selectedRelayer?.url ?? "custom"}
        onChange={(event) => {
          if (event.target.value === "custom") {
            setCustomRelayer(undefined);
            setUsingCustomRelayer(true);
          } else {
            setSelectedRelayer(
              relayerOptions?.find(
                (relayerOption) => relayerOption.url === event.target.value
              )
            );
            setUsingCustomRelayer(false);
          }
        }}
      >
        {relayerOptions && (
          <>
            {relayerOptions.map((relayerOption, i) => (
              <option key={i} value={relayerOption.url}>
                {relayerOption.url} - {relayerOption.relayerFee}%
              </option>
            ))}
            <option value="custom">Custom</option>
          </>
        )}
      </Select>

      {usingCustomRelayer && (
        <>
          <Text variant="form" sx={{ mt: 4, mb: 2 }}>
            Custom relayer url
          </Text>
          <Input
            disabled={loading}
            name="customRelayer"
            type="text"
            value={customRelayerUrl}
            onChange={(event) => {
              const relayerUrl = event.target.value;
              setCustomRelayerUrl(relayerUrl);
              onCustomRelayerUrlChange(relayerUrl);
            }}
            placeholder="Enter custom relayer address (protocol://...)"
          />
          <Text sx={{ mt: 2, color: "red" }} variant="form">
            {customRelayerError}
          </Text>
        </>
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
                if (!validNote) {
                  alert("Note is not valid");
                  return;
                }
                if (!validRecipient) {
                  alert("Recipient address is not valid");
                  return;
                }
                onWithdrawClick();
              }}
              disabled={(() => {
                if (!isValidNote) {
                  return true;
                }
                if (!web3.utils.isAddress(recipient)) {
                  return true;
                }
                if (usingCustomRelayer) {
                  if (!customRelayer) {
                    return true;
                  }
                }
                return false;
              })()}
            >
              Withdraw
            </Button>
          </Flex>
        </BottomDrawer>
      )}
    </div>
  );
};
