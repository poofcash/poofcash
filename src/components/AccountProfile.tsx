import { useWeb3React } from "@web3-react/core";
import { useAccountName } from "hooks/accountName";
import React from "react";
import { Flex } from "theme-ui";
import { BlockscoutAddressLink } from "components/Links";
import { Text } from "theme-ui";
import axios from "axios";
import { IP_URL } from "config";
import { ProfileIcon } from "icons/ProfileIcon";

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
  const { account } = useWeb3React();
  const accountName = useAccountName();

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
        {account ? (
          <BlockscoutAddressLink address={account}>
            <Text variant="wallet">{accountName}</Text>
          </BlockscoutAddressLink>
        ) : (
          <Text variant="wallet">????...????</Text>
        )}
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
