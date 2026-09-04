"use client";

import { useEffect, useState } from "react";

import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/** WMO weather codes, grouped into the states worth drawing differently. */
const CONDITIONS = [
  { codes: [0], Icon: Sun, label: "Clear", light: "250 204 21" },
  { codes: [1, 2], Icon: CloudSun, label: "Partly cloudy", light: "147 197 253" },
  { codes: [3], Icon: Cloud, label: "Overcast", light: "148 163 184" },
  { codes: [45, 48], Icon: CloudFog, label: "Fog", light: "203 213 225" },
  { codes: [51, 53, 55, 56, 57], Icon: CloudDrizzle, label: "Drizzle", light: "125 211 252" },
  { codes: [61, 63, 65, 66, 67, 80, 81, 82], Icon: CloudRain, label: "Rain", light: "56 189 248" },
  { codes: [71, 73, 75, 77, 85, 86], Icon: CloudSnow, label: "Snow", light: "224 242 254" },
  { codes: [95, 96, 99], Icon: CloudLightning, label: "Storm", light: "167 139 250" },
] as const;

/* Long enough that a tab left open all day makes a handful of requests. */
const REFRESH_MS = 10 * 60 * 1000;

type Reading = { temp: number; code: number; city: string };

const Weather = (): React.JSX.Element => {
  const [reading, setReading] = useState<Reading | null>(null);
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_LOCATION_ENDPOINT;
    if (!endpoint) return;

    const located = new URL(endpoint);
    located.searchParams.set("fields", "latitude,longitude,city");

    const controller = new AbortController();

    const read = async () => {
      try {
        const place = await fetch(located, { signal: controller.signal });
        if (!place.ok) return;

        const { latitude, longitude, city } = await place.json();
        if (typeof latitude !== "number" || typeof longitude !== "number")
          return;

        const query = new URLSearchParams({
          latitude: latitude.toFixed(2),
          longitude: longitude.toFixed(2),
          current: "temperature_2m,weather_code",
        });

        const forecast = await fetch(
          `https://api.open-meteo.com/v1/forecast?${query}`,
          { signal: controller.signal },
        );
        if (!forecast.ok) return;

        const { current } = await forecast.json();
        setReading({
          temp: Math.round(current.temperature_2m),
          code: current.weather_code,
          city: typeof city === "string" ? city : "",
        });
      } catch {
        /* Offline, blocked or aborted: the capsule stays plain navigation
           rather than showing someone else's weather as if it were theirs. */
      }
    };

    read();
    const timer = setInterval(read, REFRESH_MS);

    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, []);

  const condition =
    CONDITIONS.find((entry) =>
      entry.codes.some((code) => code === reading?.code),
    ) ?? CONDITIONS[2];

  return (
    <>
      {reading && (
        <motion.span
          aria-hidden
          initial={false}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.45, ease: "easeOut" }}
          className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-32 rounded-full md:block"
          style={{
            background: `radial-gradient(120px 40px at 82% 50%, rgb(${condition.light} / 0.30), rgb(${condition.light} / 0.10) 45%, transparent 72%)`,
          }}
        />
      )}

      <AnimatePresence initial={false}>
        {reading && (
          <motion.span
            key="weather"
            title={`${reading.city || "Your area"} · ${condition.label}`}
            onHoverStart={() => setOpen(true)}
            onHoverEnd={() => setOpen(false)}
            initial={prefersReduced ? { opacity: 0 } : { width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { width: 0, opacity: 0 }}
            transition={
              prefersReduced
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 400, damping: 26 }
            }
            className="hidden cursor-default overflow-hidden whitespace-nowrap md:block"
          >
            <motion.span
              initial={prefersReduced ? false : { x: -12 }}
              animate={{ x: 0 }}
              transition={
                prefersReduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 400, damping: 30 }
              }
              className="ml-1.5 mr-3.5 flex items-center gap-1.5 border-l border-primary/15 pl-3 text-sm font-medium text-primary/70 transition-colors duration-200 hover:text-primary"
            >
              <condition.Icon aria-hidden className="relative z-10 size-4 shrink-0" />
              <span className="relative z-10 tabular-nums">{reading.temp}°</span>

              <span className="sr-only">
                {reading.city ? `${reading.city}, ` : ""}
                {condition.label}
              </span>
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
};

export default Weather;
