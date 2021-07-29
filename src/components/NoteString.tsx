import { ClipboardIcon } from "icons/ClipboardIcon";
import React from "react";
import { Flex, Input, Text } from "theme-ui";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { downloadFile } from "utils/file";
import { parseNote } from "utils/snarks-functions";
import { toast } from "react-toastify";

interface IProps {
  noteString: string;
}

export const NoteString: React.FC<IProps> = ({ noteString }) => {
  const { amount, currency } = parseNote(noteString);
  return (
    <Flex>
      <Input
        sx={{
          backgroundColor: ["box", "background"],
          borderRadius: "6px 0px 0px 6px",
          border: "none",
          maxWidth: "80rem",
        }}
        readOnly
        value={noteString}
      />
      <CopyToClipboard
        onCopy={() => {
          toast("Copied to clipboard.");
          downloadFile(
            `${amount.replace(".", "_")} ${currency} Poof note`,
            noteString
          );
        }}
        text={noteString}
      >
        <Flex
          sx={{
            alignItems: "center",
            borderRadius: "0px 6px 6px 0px",
            backgroundColor: "accent",
            p: "14px",
            cursor: "pointer",
          }}
        >
          <ClipboardIcon />
          <Text
            color="white"
            sx={{
              pr: 2,
              fontWeight: 600,
              fontSize: 18,
              lineHeight: "20px",
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
