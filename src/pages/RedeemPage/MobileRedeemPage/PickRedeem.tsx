import React from "react";
import {
  Button,
  Container,
  Flex,
  Input,
  Link,
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
import web3 from "web3";
import { Page } from "state/global";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { PoofKitLoading } from "components/PoofKitLoading";
import { RelayerOption } from "hooks/useRelayer";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { redeemMaxAmount } from "../state";

interface IProps {
  onRedeemClick: () => void;
  setAmount: (amount: string) => void;
  amount: string;
  poofAmount: string;
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
  relayerFee: string;
}

export const PickRedeem: React.FC<IProps> = ({
  onRedeemClick,
  setAmount,
  amount,
  poofAmount,
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
  relayerFee,
}) => {
  const breakpoint = useBreakpoint();
  const [maxRedeemAmount, setMaxRedeemAmount] = useRecoilState(redeemMaxAmount);
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
  const history = useHistory();
  const { poofKit, poofKitLoading } = PoofKitGlobal.useContainer();
  const { poofAccount, actWithPoofAccount } = PoofAccountGlobal.useContainer();
  const [unlockLoading, setUnlockLoading] = React.useState(false);

  if (poofKitLoading) {
    return <PoofKitLoading />;
  }

  const unlockPoofAccount = async () => {
    actWithPoofAccount(
      (privateKey) => {
        setUnlockLoading(true);
        poofKit
          ?.apBalance(privateKey)
          .then((apBalance) => setMaxRedeemAmount(apBalance.toString()))
          .catch(console.error)
          .finally(() => setUnlockLoading(false));
      },
      () => {}
    );
  };

  let button = (
    <Button onClick={() => history.push(`/${Page.SETUP}`)}>
      Connect Poof account
    </Button>
  );
  if (poofAccount) {
    button = <Button onClick={unlockPoofAccount}>Unlock Poof account</Button>;
    if (maxRedeemAmount != null) {
      button = (
        <Button
          onClick={() => {
            onRedeemClick();
          }}
          disabled={(() => {
            if (amount === "" || recipient === "") {
              return true;
            }
            if (Number(amount) + Number(relayerFee) > Number(maxRedeemAmount)) {
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
      <Flex
        sx={{
          justifyContent: "space-between",
          alignItems: "baseline",
          mt: 3,
          mb: 1,
        }}
      >
        <Text variant="form">AP Amount</Text>
        <Text variant="form">
          <Link
            onClick={() => {
              const balance = Number(maxRedeemAmount || 0);
              // Fee + a 0.001 wiggle
              const fee =
                Number(selectedRelayer?.miningServiceFee || 0) + 0.001;
              const max = Math.floor(balance * (1 - fee / 100));
              setAmount(max.toString());
            }}
          >
            max: {Number(maxRedeemAmount || 0).toLocaleString()} AP
          </Link>
        </Text>
      </Flex>
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
      {maxRedeemAmount != null &&
        amount !== "" &&
        Number(amount) + Number(relayerFee) > Number(maxRedeemAmount) && (
          <>
            <Text sx={{ mt: 2, color: "red" }} variant="form">
              Amount + Relayer Fee exceeds maximum: {maxRedeemAmount || 0} AP
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

      {breakpoint === Breakpoint.DESKTOP && (
        <Container mt={4}>
          {loading || unlockLoading ? <Spinner /> : button}
        </Container>
      )}

      {breakpoint === Breakpoint.MOBILE && (
        <ActionDrawer>
          <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <LabelWithBalance
              label="Total"
              amount={poofAmount}
              currency={"POOF"}
            />
            {button}
          </Flex>
        </ActionDrawer>
      )}
    </div>
  );
};
