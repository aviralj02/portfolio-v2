"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type { Timeline } from "@/lib/experience";
import { cn } from "@/lib/utils";

type Props = {
  timeline: Timeline;
};

/** Wide enough that even a three-month role is a comfortable target. */
const PX_PER_MONTH = 68;
const CARD_WIDTH = 264;

const RAMP = ["#0e7490", "#0d9488", "#14b8a6", "#10b981", "#34d399"];

const ExperienceTimeline = ({ timeline }: Props): React.JSX.Element => {
  const { entries, ticks, marks, months, from, to } = timeline;
  const prefersReduced = useReducedMotion();

  /* The current role is the one worth landing on, and entries arrive newest
     first. */
  const [active, setActive] = useState(() => {
    const current = entries.findIndex((item) => item.current);

    return current === -1 ? 0 : current;
  });

  const scroller = useRef<HTMLDivElement>(null);

  /* On arrival the strip plays itself from the first role to the current one,
     so the span is shown rather than described — the reader sees how far the
     scale runs before it settles on now.
     
     Duration follows the distance so the strip travels at roughly one speed
     whatever the screen width (~0.6ms per pixel), and any wheel, drag or touch hands control
     straight back: an intro that fights the reader is worse than none. */
  useEffect(() => {
    const node = scroller.current;
    if (!node) return;

    const distance = node.scrollWidth - node.clientWidth;
    if (distance <= 0) return;

    if (prefersReduced) {
      node.scrollLeft = distance;
      return;
    }

    node.scrollLeft = 0;

    let frame = 0;
    let startedAt = 0;
    const duration = Math.min(1400, Math.max(450, distance * 0.6));
    const easeOut = (t: number) => 1 - (1 - t) ** 3;

    const step = (now: number) => {
      startedAt ||= now;
      const progress = Math.min(1, (now - startedAt) / duration);

      node.scrollLeft = distance * easeOut(progress);
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };

    /* Next tick, so the strip is on screen before it starts travelling. */
    const timer = setTimeout(() => {
      frame = requestAnimationFrame(step);
    }, 220);

    for (const event of ["wheel", "touchstart", "pointerdown"]) {
      node.addEventListener(event, stop, { passive: true });
    }

    return () => {
      stop();
      for (const event of ["wheel", "touchstart", "pointerdown"]) {
        node.removeEventListener(event, stop);
      }
    };
  }, [prefersReduced]);

  const width = Math.round(months * PX_PER_MONTH);
  const entry = entries[active];
  const colourOf = (index: number) => RAMP[entries.length - 1 - index] ?? RAMP[0];

  return (
    <div
      ref={scroller}
      className={cn(
        "no-scrollbar -mx-6 overflow-x-auto px-6 md:-mx-20 md:px-20",
        "[mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]",
      )}
    >
      <div className="relative" style={{ width }}>
        <div className="relative h-5">
          {/* Bookends sit flush to the ends; quarter marks are centred on
              their own tick. */}
          <span className="absolute left-0 text-[11px] tabular-nums text-muted-foreground/70">
            {from}
          </span>

          {/* A quarter mark landing under a bookend is dropped rather than
              overprinted — the tail one collided with "Now". */}
          {ticks
            .filter((tick) => tick.at > 0.04 && tick.at < 0.94)
            .map((tick) => (
              <span
                key={tick.label + tick.at}
                className="absolute -translate-x-1/2 text-[11px] tabular-nums text-muted-foreground/70"
                style={{ left: `${tick.at * 100}%` }}
              >
                {tick.label}
              </span>
            ))}

          <span className="absolute right-0 text-[11px] tabular-nums text-muted-foreground/70">
            {to}
          </span>
        </div>

        {/* The ruler. Minor mark every month, taller one every quarter. */}
        <div aria-hidden className="relative mt-2 h-3 border-t border-border">
          {marks.map((at, index) => (
            <span
              key={at}
              className={cn(
                "absolute top-0 w-px",
                index % 3 === 0 ? "h-3 bg-border" : "h-1.5 bg-border/60",
              )}
              style={{ left: `${at * 100}%` }}
            />
          ))}
        </div>

        <div className="relative mt-3 h-10">
          {entries.map((item, index) => {
            const colour = colourOf(index);
            const selected = index === active;

            return (
              <button
                key={item.company}
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                aria-label={`${item.company} — ${item.role}, ${item.range}`}
                aria-pressed={selected}
                className={cn(
                  "absolute top-0 flex h-10 items-center gap-2 overflow-hidden rounded-full px-3",
                  "cursor-pointer transition-[background-color,border-color] duration-200",
                )}
                style={{
                  left: `${item.offset * 100}%`,
                  width: `calc(${item.width * 100}% - 4px)`,
                  /* A tint plus a solid edge: the tint alone dies on one theme
                     or the other, and solid fill would leave no colour that
                     text of either polarity could sit on. */
                  backgroundColor: `${colour}${selected ? "40" : "22"}`,
                  border: `1px solid ${colour}${selected ? "" : "99"}`,
                }}
              >
                <Image
                  src={item.logo.url}
                  alt=""
                  width={22}
                  height={22}
                  className="size-[22px] shrink-0 rounded-[5px] object-cover"
                />

                <span className="truncate text-[12px] font-medium tabular-nums text-primary">
                  {item.duration}
                </span>

                {item.current && (
                  <span className="ml-auto size-2 shrink-0 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Reserved, so the card never clips against the scroller and nothing
            shifts when it changes. */}
        <div className="relative mt-4 h-[104px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {entry && (
              <motion.div
                key={entry.company}
                initial={
                  prefersReduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: 14, scale: 0.94 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                transition={
                  prefersReduced
                    ? { duration: 0.15 }
                    : { type: "spring", stiffness: 520, damping: 22, mass: 0.7 }
                }
                className="absolute top-0 rounded-xl border border-border bg-card p-4"
                style={{
                  width: CARD_WIDTH,
                  /* Anchored under its own bar, pulled back at the tail so the
                     last role's card stays inside the scrollable width. */
                  left: Math.min(entry.offset * width, width - CARD_WIDTH),
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Image
                    src={entry.logo.url}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 shrink-0 rounded-lg object-cover"
                  />

                  <span className="flex min-w-0 flex-col">
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1 truncate text-sm font-medium text-primary"
                    >
                      {entry.company}
                      <ArrowUpRight
                        aria-hidden
                        className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                    <span className="truncate text-[13px] text-muted-foreground">
                      {entry.role}
                    </span>
                  </span>
                </div>

                <p className="mt-3 text-xs tabular-nums text-muted-foreground/70">
                  {entry.range}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ExperienceTimeline;
