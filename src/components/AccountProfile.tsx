import React from "react";
import { Flex } from "theme-ui";
import { BlockscoutAddressLink } from "components/Links";
import { Text } from "theme-ui";
import axios from "axios";
import { IP_URL } from "config";
import { ProfileIcon } from "icons/ProfileIcon";
import { useContractKit } from "@celo-tools/use-contractkit";
import { shortenAccount } from "hooks/accountName";

type UserLocation = {
  country: string;
  region: string;
  eu: string;
  timezone: string;
  city: string;
  ll: Array<number>;
  metro: number;
  area: number;
  ip: string;
};

export const AccountProfile: React.FC = () => {
  const { address, destroy } = useContractKit();

  const [userLocation, setUserLocation] = React.useState<UserLocation>();
  React.useEffect(() => {
    axios
      .get(IP_URL)
      .then(({ data }) => setUserLocation(data))
      .catch(console.error);
  }, []);

  return (
    <Flex sx={{ alignItems: "center", justifyContent: "flex-end" }}>
      <Flex
        sx={{
          flexDirection: "column",
          maxWidth: "50vw",
          mr: 2,
          textAlign: "right",
        }}
      >
        <Flex
          sx={{
            alignItems: "baseline",
            justifyContent: address ? "space-between" : "flex-end",
          }}
        >
          {address ? (
            <BlockscoutAddressLink address={address}>
              <Text variant="wallet">{shortenAccount(address)}</Text>
            </BlockscoutAddressLink>
          ) : (
            <Text variant="wallet">????...????</Text>
          )}
          {address && (
            <>
              <Text>/</Text>
              <Text sx={{ cursor: "pointer" }} onClick={destroy} variant="form">
                Disconnect
              </Text>
            </>
          )}
        </Flex>
        {userLocation && (
          <Text variant="form">
            IP: {userLocation.ip}, {userLocation.city}, {userLocation.country}
          </Text>
        )}
      </Flex>
      <ProfileIcon />
    </Flex>
  );
};
