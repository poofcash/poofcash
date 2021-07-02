import moment from "moment";
import React from "react";
import { Donut, Text, Flex } from "theme-ui";

interface IProps {
  start: number;
  end: number;
}

export const Countdown: React.FC<IProps> = ({ start, end }) => {
  const [currentTime, setCurrentTime] = React.useState(moment());
  React.useEffect(() => {
    setInterval(() => {
      setCurrentTime(moment());
    }, 1000);
  }, []);

  const diff = (end - currentTime.unix()) * 1000;

  const countdownText = moment
    .utc(diff)
    .format("DD [days:]HH [hours:]mm [minutes:]ss [seconds]");
  const comps = countdownText.split(":");

  return (
    <Flex sx={{ alignItems: "center", flexDirection: "column" }}>
      <Donut
        variant="styles.countdown"
        min={start}
        max={end}
        value={currentTime.unix()}
        title="Countdown"
      />
      <div>
        {comps.map((comp, idx) => {
          const [num, unit] = comp.split(" ");
          return (
            <React.Fragment key={idx}>
              <Text variant="bold">{num}</Text> <Text mr={2}>{unit}</Text>
            </React.Fragment>
          );
        })}
      </div>
    </Flex>
  );
};
