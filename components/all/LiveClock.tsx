"use client";

import { useEffect, useState } from "react";

// The clock is "my" time, so it's pinned to India rather than the visitor's zone.
const TIME_ZONE = "Asia/Kolkata";

const LiveClock = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const time = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: TIME_ZONE,
  });

  return (
    <time
      dateTime={currentTime.toISOString()}
      className="tabular-nums text-foreground"
    >
      {time}
    </time>
  );
};

export default LiveClock;
