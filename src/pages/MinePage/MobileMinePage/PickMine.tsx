import React from "react";
import { Button, Flex, Input, Select, Text } from "theme-ui";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";
import { useDebounce } from "hooks/debounce";
import { isValidHttpUrl } from "utils/url.utils";
import axios from "axios";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";
import { useDispatch } from "react-redux";
import { Page, setCurrentPage } from "state/global";
import { usePoofAccount } from "hooks/poofAccount";
import { PoofKitLoading } from "components/PoofKitLoading";
import { PoofKitGlobal } from "hooks/poofUtils";

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
  const { poofAccount } = usePoofAccount();
  const dispatch = useDispatch();

  const { poofKitLoading } = PoofKitGlobal.useContainer();

  if (poofKitLoading) {
    return <PoofKitLoading />;
  }

  let button = (
    <Button
      variant="secondary"
      onClick={() => dispatch(setCurrentPage({ nextPage: Page.SETUP }))}
    >
      Connect Poof account
    </Button>
  );
  if (poofAccount) {
    button = (
      <Button
        variant="secondary"
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
        Magic password{" "}
      </Text>
      <Input
        mb={4}
        disabled={loading}
        name="note"
        type="text"
        placeholder="Enter note here"
        onChange={(e) => setNote(e.target.value)}
        value={note}
        pattern="/poof-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g"
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
              amount={estimatedAp}
              currency="AP"
            />
            {button}
          </Flex>
        </BottomDrawer>
      )}
    </div>
  );
};
