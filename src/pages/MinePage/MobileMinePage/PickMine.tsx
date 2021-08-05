import React from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Input,
  Select,
  Spinner,
  Text,
} from "theme-ui";
import { ActionDrawer } from "components/ActionDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { Breakpoint, useBreakpoint } from "hooks/useBreakpoint";
import { useDebounce } from "hooks/useDebounce";
import { isValidHttpUrl } from "utils/url.utils";
import axios from "axios";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { PoofKitLoading } from "components/PoofKitLoading";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { RelayerOption } from "hooks/useRelayer";
import { NoteList, NoteListMode } from "components/DepositList";
import { useHistory } from "react-router-dom";
import { Page } from "state/global";

interface IProps {
  onMineClick: () => void;
  setNote: (note: string) => void;
  note: string;
  noteIsValid: boolean;
  estimatedAp: number;
  loading?: boolean;
  selectedRelayer?: RelayerOption;
  setSelectedRelayer: (relayer?: RelayerOption) => void;
  relayerOptions?: Array<RelayerOption>;
  usingCustomRelayer: boolean;
  setUsingCustomRelayer: (usingCustomRelayer: boolean) => void;
  customRelayer?: RelayerOption;
  setCustomRelayer: (relayerOption?: RelayerOption) => void;
  relayerFee: string;
}

export const PickMine: React.FC<IProps> = ({
  onMineClick,
  setNote,
  note,
  noteIsValid,
  estimatedAp,
  loading,
  selectedRelayer,
  setSelectedRelayer,
  relayerOptions,
  usingCustomRelayer,
  setUsingCustomRelayer,
  customRelayer,
  setCustomRelayer,
  relayerFee,
}) => {
  const breakpoint = useBreakpoint();
  const [customRelayerError, setCustomRelayerError] = React.useState<
    string | null
  >(null);

  const [customRelayerUrl, setCustomRelayerUrl] = React.useState("");
  const onCustomRelayerUrlChange = useDebounce((relayerUrl) => {
    if (isValidHttpUrl(relayerUrl)) {
      axios
        .get(relayerUrl + "/status")
        .then(({ data }) =>
          setCustomRelayer({
            url: relayerUrl,
            relayerFee: data.poofServiceFee,
            miningServiceFee: data.miningServiceFee,
            gasPrices: data.gasPrices,
            celoPrices: data.celoPrices,
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
  const { poofAccount } = PoofAccountGlobal.useContainer();
  const history = useHistory();

  const { poofKitLoading } = PoofKitGlobal.useContainer();
  const totalMineAmount = Number(estimatedAp) - Number(relayerFee);

  if (poofKitLoading) {
    return <PoofKitLoading />;
  }

  let button = (
    <Button onClick={() => history.push(`/${Page.SETUP}`)}>
      Connect Poof account
    </Button>
  );
  if (poofAccount) {
    button = (
      <Button
        onClick={() => {
          if (!noteIsValid) {
            alert("Note is not valid");
            return;
          }
          onMineClick();
        }}
        disabled={(() => {
          if (!noteIsValid) {
            return true;
          }
          if (usingCustomRelayer) {
            if (!customRelayer) {
              return true;
            }
          }
          if (totalMineAmount < 0) {
            return true;
          }
          return false;
        })()}
      >
        Mine
      </Button>
    );
  }

  return (
    <div>
      <Text variant="form" sx={{ mb: 2 }}>
        Magic password
      </Text>
      <Input
        mb={2}
        disabled={loading}
        name="note"
        type="text"
        placeholder="Enter magic password here"
        onChange={(e) => setNote(e.target.value)}
        value={note}
        pattern="/poof-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g"
        autoComplete="off"
      />
      {note !== "" && !noteIsValid && (
        <>
          <Text sx={{ mt: 2, color: "red" }} variant="form">
            Invalid note, please try again.
          </Text>
          <br />
        </>
      )}

      <Text variant="form" sx={{ mt: 4, mb: 2 }}>
        Relayer
      </Text>
      <Select
        mb={2}
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

      {breakpoint === Breakpoint.DESKTOP && (
        <Container mt={4}>{loading ? <Spinner /> : button}</Container>
      )}

      {breakpoint === Breakpoint.MOBILE && (
        <>
          <Divider my={4} />
          <Box>
            <NoteList mode={NoteListMode.WITHDRAWS} onFill={setNote} />
          </Box>
          <ActionDrawer>
            <Flex
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <LabelWithBalance
                label="Total"
                amount={estimatedAp}
                currency="AP"
              />
              {button}
            </Flex>
          </ActionDrawer>
        </>
      )}
    </div>
  );
};
