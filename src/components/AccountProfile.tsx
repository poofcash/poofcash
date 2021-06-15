import React from "react";
import { Flex } from "theme-ui";
import { BlockscoutAddressLink } from "components/Links";
import { Text } from "theme-ui";
import { useContractKit } from "@celo-tools/use-contractkit";
import { shortenAccount } from "hooks/accountName";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "state";
import { setAccount } from "state/user";
import { Page, setCurrentPage } from "state/global";

export const AccountProfile: React.FC = () => {
  const { address, destroy, connect } = useContractKit();
  const poofAccount = useSelector((state: AppState) => state.user.poofAccount);
  const dispatch = useDispatch();

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
              <Text variant="wallet" mr={2}>
                {shortenAccount(address)}
              </Text>
            </BlockscoutAddressLink>
          ) : (
            <Text variant="wallet" mr={2}>
              0x????...????
            </Text>
          )}
          {address ? (
            <>
              <Text
                sx={{ whiteSpace: "nowrap", cursor: "pointer" }}
                onClick={destroy}
                variant="form"
              >
                Disconnect
              </Text>
            </>
          ) : (
            <>
              <Text
                sx={{ whiteSpace: "nowrap", cursor: "pointer" }}
                onClick={connect}
                variant="form"
              >
                Connect
              </Text>
            </>
          )}
        </Flex>

        <Flex
          sx={{
            alignItems: "baseline",
            justifyContent: address ? "space-between" : "flex-end",
          }}
        >
          {poofAccount?.address ? (
            <Text variant="account" mr={2}>
              {shortenAccount(poofAccount?.address)}
            </Text>
          ) : (
            <Text variant="account" mr={2}>
              ????...????
            </Text>
          )}
          {poofAccount?.address ? (
            <>
              <Text
                sx={{ whiteSpace: "nowrap", cursor: "pointer" }}
                onClick={() => dispatch(setAccount({ poofAccount: undefined }))}
                variant="form"
              >
                Logout
              </Text>
            </>
          ) : (
            <>
              <Text
                sx={{ whiteSpace: "nowrap", cursor: "pointer" }}
                onClick={() =>
                  dispatch(setCurrentPage({ nextPage: Page.SETUP }))
                }
                variant="form"
              >
                Login
              </Text>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
