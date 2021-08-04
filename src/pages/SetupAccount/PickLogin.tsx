import React from "react";
import { PoofAccountGlobal } from "hooks/poofAccount";
import { useHistory, Link } from "react-router-dom";
import { Button, Text, Input, Box } from "theme-ui";
import { isPrivateKey } from "utils/eth";
import { toast } from "react-toastify";
import { Page } from "state/global";
import { DividerWithText } from "components/DividerWithText";

export const PickLogin: React.FC = () => {
  const [privateKey, setPrivateKey] = React.useState("");
  const { savePoofAccount } = PoofAccountGlobal.useContainer();
  const history = useHistory();

  return (
    <>
      <Text variant="form" sx={{ mb: 2 }}>
        Private key
      </Text>
      <Input
        name="privateKey"
        type="text"
        placeholder="Enter private key here"
        onChange={(e) => setPrivateKey(e.target.value)}
        value={privateKey}
        autoComplete="off"
        mb={2}
      />
      {privateKey !== "" && !isPrivateKey(privateKey) && (
        <Text sx={{ mt: 2, color: "red" }} variant="form">
          Invalid private key, please try again.
        </Text>
      )}
      <Button
        variant="primary"
        sx={{ width: "100%" }}
        mt={2}
        mb={4}
        onClick={() => {
          if (!isPrivateKey(privateKey)) {
            toast("Invalid private key. Please try again.");
            return;
          }
          savePoofAccount(privateKey, () => {
            history.push(`/${Page.DEPOSIT}`);
          });
        }}
      >
        Log in with Poof Account
      </Button>
      <DividerWithText text="or" />
      <Box mt={4}>
        <Link to={Page.SETUP_CREATE}>
          <Button sx={{ width: "100%" }} variant="secondary">
            Create a Poof account
          </Button>
        </Link>
      </Box>
    </>
  );
};
