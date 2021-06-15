import { ClipboardIcon } from "icons/ClipboardIcon";
import React from "react";
import { Flex, Input, Text } from "theme-ui";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { downloadFile } from "utils/file";

interface IProps {
  privateKey: string;
}

export const PoofPrivateKey: React.FC<IProps> = ({ privateKey }) => {
  return (
    <Flex>
      <Input
        sx={{
          background: "#F1F4F4",
          borderRadius: "6px 0px 0px 6px",
          border: "none",
          maxWidth: "80rem",
        }}
        readOnly
        value={privateKey}
      />
      <CopyToClipboard
        onCopy={() => {
          alert("Copied to clipboard.");
          downloadFile("poof_private_key", privateKey);
        }}
        text={privateKey}
      >
        <Flex
          sx={{
            alignItems: "center",
            borderRadius: "0px 6px 6px 0px",
            backgroundColor: "#7C71FD",
            p: "14px",
            cursor: "pointer",
          }}
        >
          <ClipboardIcon />
          <Text
            sx={{
              pr: 2,
              fontWeight: 600,
              fontSize: 18,
              lineHeight: "20px",
              color: "#F1F4F4",
              ml: 1,
            }}
          >
            Copy
          </Text>
        </Flex>
      </CopyToClipboard>
    </Flex>
  );
};
