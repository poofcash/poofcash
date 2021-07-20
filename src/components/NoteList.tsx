import React from "react";
import { Button } from "theme-ui";
import { downloadFile } from "utils/file";
import { NoteString } from "components/NoteString";

interface IListProps {
  notes: string[];
}

export const NoteList: React.FC<IListProps> = ({ notes }) => {
  if (notes.length === 0) {
    return null;
  }
  return notes.length > 1 ? (
    <Button
      onClick={() => {
        downloadFile(`${notes.length} Poof note backup`, notes.join("\n"));
      }}
    >
      Download {notes.length} notes
    </Button>
  ) : (
    <NoteString noteString={notes[0]} />
  );
};
