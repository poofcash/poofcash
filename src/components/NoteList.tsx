import React from "react";
import { Box } from "theme-ui";
import { FixedSizeList } from "react-window";
import { NoteString } from "./NoteString";

interface IItemProps {
  index: number;
  data: string[];
  style: React.CSSProperties;
}

const Row: React.FC<IItemProps> = ({ index, data, style }) => {
  const noteString = data[index];
  return (
    <Box style={style}>
      <NoteString noteString={noteString} />
    </Box>
  );
};

interface IListProps {
  notes: string[];
}

export const NoteList: React.FC<IListProps> = ({ notes }) => {
  return (
    <FixedSizeList
      height={80}
      width="100%"
      itemData={notes}
      itemCount={notes.length}
      itemSize={60}
      style={{ marginBottom: "8px" }}
    >
      {Row}
    </FixedSizeList>
  );
};
