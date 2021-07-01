import React from "react";
import { Button, Flex, Input, Select, Text } from "theme-ui";
import { BottomDrawer } from "components/BottomDrawer";
import { LabelWithBalance } from "components/LabelWithBalance";
import { Breakpoint, useBreakpoint } from "hooks/breakpoint";
import { useDebounce } from "hooks/debounce";
import { isValidHttpUrl } from "utils/url.utils";
import axios from "axios";
import web3 from "web3";
import { RelayerOption } from "pages/WithdrawPage/DesktopWithdrawPage";
import { useDispatch } from "react-redux";
import { Page, setCurrentPage } from "state/global";
import { usePoofAccount } from "hooks/poofAccount";
import { PoofKitGlobal } from "hooks/poofUtils";
import { PoofKitLoading } from "components/PoofKitLoading";

interface IProps {
  onRedeemClick: () => void;
  setAmount: (amount: string) => void;
  amount: string;
  poofAmount: string;
  setRecipient: (recipient: string) => void;
  recipient: string;
  setMaxRedeemAmount?: (maxRedeemAmount: string) => void;
  maxRedeemAmount?: string;
  loading?: boolean;
  selectedRelayer?: RelayerOption;
  setSelectedRelayer: (relayer?: RelayerOption) => void;
  relayerOptions?: Array<RelayerOption>;
  usingCustomRelayer: boolean;
  setUsingCustomRelayer: (usingCustomRelayer: boolean) => void;
  customRelayer?: RelayerOption;
  setCustomRelayer: (relayerOption?: RelayerOption) => void;
}

export const PickRedeem: React.FC<IProps> = ({
  onRedeemClick,
  setAmount,
  amount,
  poofAmount,
  setRecipient,
  recipient,
  setMaxRedeemAmount,
  maxRedeemAmount,
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
  const dispatch = useDispatch();
  const { poofKit, poofKitLoading } = PoofKitGlobal.useContainer();
  const { poofAccount, actWithPoofAccount } = usePoofAccount();

  if (poofKitLoading) {
    return <PoofKitLoading />;
  }

  const unlockPoofAccount = async () => {
    actWithPoofAccount(
      (privateKey) => {
        poofKit
          ?.apBalance(privateKey)
          .then(
            (apBalance) =>
              setMaxRedeemAmount && setMaxRedeemAmount(apBalance.toString())
          )
          .catch(console.error);
      },
      () => {}
    );
  };

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
      <Button variant="secondary" onClick={unlockPoofAccount}>
        Unlock Poof account
      </Button>
    );
    if (maxRedeemAmount != null) {
      button = (
        <Button
          variant="secondary"
          onClick={() => {
            onRedeemClick();
          }}
          disabled={(() => {
            if (amount === "" || recipient === "") {
              return true;
            }
            if (Number(amount) > Number(maxRedeemAmount)) {
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
          Redeem
        </Button>
      );
    }
  }

  return (
    <div>
      <Text variant="form" sx={{ mb: 2 }}>
        AP Amount (max: {Number(maxRedeemAmount || 0).toLocaleString()} AP)
      </Text>
      <Input
        mb={2}
        disabled={loading}
        name="ap"
        type="number"
        placeholder="Enter AP amount here"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
        min="0"
        max={maxRedeemAmount || 0}
        step="1"
      />
      {amount !== "" && Number(amount) > Number(maxRedeemAmount) && (
        <>
          <Text sx={{ mt: 2, color: "red" }} variant="form">
            Amount exceeds maximum: {maxRedeemAmount || 0} AP
          </Text>
          <br />
        </>
      )}

      <Text variant="form" sx={{ mt: 4, mb: 2 }}>
        Recipient address
      </Text>
      <Input
        mb={2}
        disabled={loading}
        name="recipientAddress"
        type="text"
        onChange={(e) => setRecipient(e.target.value)}
        value={recipient}
        placeholder="Enter wallet address here"
      />
      {recipient !== "" && !validRecipient && (
        <>
          <Text sx={{ mt: 2, color: "red" }} variant="form">
            Invalid address, please try again.
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

      {breakpoint === Breakpoint.MOBILE && (
        <BottomDrawer>
          <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <LabelWithBalance
              label="Total"
              amount={poofAmount}
              currency={"POOF"}
            />
            {button}
          </Flex>
        </BottomDrawer>
      )}
    </div>
  );
};
