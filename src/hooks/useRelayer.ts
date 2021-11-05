import { useContractKit } from "@celo-tools/use-contractkit";
import axios from "axios";
import { RELAYERS } from "config";
import React from "react";

export type RelayerOption = {
  url: string;
  relayerFee: number;
  miningServiceFee: number;
  gasPrices: Record<string, string>;
  celoPrices: Record<string, string>;
};

export const useRelayer = () => {
  const [selectedRelayer, setSelectedRelayer] = React.useState<RelayerOption>();
  const [relayerOptions, setRelayerOptions] = React.useState<
    Array<RelayerOption>
  >([]);
  const [customRelayer, setCustomRelayer] = React.useState<RelayerOption>();
  const [usingCustomRelayer, setUsingCustomRelayer] = React.useState<boolean>(
    false
  );
  const { network } = useContractKit();

  React.useEffect(() => {
    const fn = async () => {
      const statuses = (
        await Promise.all(
          RELAYERS[network.chainId].map((relayerUrl: string) => {
            return axios.get(relayerUrl + "/status", { timeout: 5000 }).catch((e) => e);
          })
        )
      ).filter((result) => {
        if (result instanceof Error) {
          console.error(result);
          return false;
        }
        return true;
      });

      const relayerOptions = statuses.map((status) => ({
        url: status.config.url.split("/status")[0],
        relayerFee: status.data.poofServiceFee,
        miningServiceFee: status.data.miningServiceFee,
        gasPrices: status.data.gasPrices,
        celoPrices: status.data.celoPrices,
      }));

      setRelayerOptions(relayerOptions);
      if (relayerOptions.length > 0) {
        setSelectedRelayer(relayerOptions[0]);
      } else {
        setUsingCustomRelayer(true);
      }
    };
    fn();
  }, [setRelayerOptions, setSelectedRelayer, network]);

  const relayer = React.useMemo(
    () => (usingCustomRelayer ? customRelayer : selectedRelayer),
    [customRelayer, selectedRelayer, usingCustomRelayer]
  );

  return {
    relayer,
    setSelectedRelayer,
    relayerOptions,
    usingCustomRelayer,
    setUsingCustomRelayer,
    customRelayer,
    setCustomRelayer,
  };
};
