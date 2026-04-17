"use client";

import { useEffect, useState } from "react";

import { CITY } from "@/lib/constants";

const TIMEZONE = "Asia/Kolkata";

const formatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: TIMEZONE,
});

const LocalTime = () => {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(formatter.format(new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="text-xs text-muted-foreground tabular-nums lg:block hidden">
      {time ? `${time} · ${CITY}` : CITY}
    </span>
  );
};

export default LocalTime;
