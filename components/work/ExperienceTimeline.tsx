"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import type { Timeline } from "@/lib/experience";
import { cn } from "@/lib/utils";

type Props = {
  timeline: Timeline;
};

/** Wide enough that even a three-month role is a comfortable target. */
const PX_PER_MONTH = 68;

/** A bar earns its duration at this width, and the company name at this one. */
const SHOW_DURATION = 72;
const SHOW_NAME = 156;

const ExperienceTimeline = ({ timeline }: Props): React.JSX.Element => {
  const { entries, ticks, months, from, to } = timeline;
  const prefersReduced = useReducedMotion();
  const idBase = useId();

  /* The current role is the one worth landing on, and entries arrive newest
     first. */
  const [active, setActive] = useState(() => {
    const current = entries.findIndex((item) => item.current);

    return current === -1 ? 0 : current;
  });

  const scroller = useRef<HTMLDivElement>(null);
  const bars = useRef<Array<HTMLButtonElement | null>>([]);

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
  const line: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 6 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] } },
  };

  const select = (index: number) => {
    const next = Math.min(Math.max(index, 0), entries.length - 1);

    setActive(next);
    bars.current[next]?.focus({ preventScroll: true });
    bars.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  /* Roles run newest first, so the reading order along the axis is the reverse. */
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: active - 1,
      ArrowLeft: active + 1,
      Home: entries.length - 1,
      End: 0,
    };
    if (moves[event.key] === undefined) return;

    event.preventDefault();
    select(moves[event.key]);
  };

  return (
    <div className="flex flex-col">
      <div
        ref={scroller}
        className={cn(
          "no-scrollbar -mx-6 overflow-x-auto px-6 md:-mx-20 md:px-20",
          "mask-[linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]",
        )}
      >
        <div className="relative" style={{ width }}>
          <div className="relative h-4">
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

          {/* One hairline a quarter, under the label it belongs to. */}
          <div aria-hidden className="relative mt-1.5 h-2 border-t border-border">
            {ticks.map((tick) => (
              <span
                key={tick.at}
                className="absolute top-0 h-2 w-px bg-border"
                style={{ left: `${tick.at * 100}%` }}
              />
            ))}
          </div>

          <div
            role="tablist"
            aria-label="Roles"
            aria-orientation="horizontal"
            onKeyDown={onKeyDown}
            className="relative mt-3.5 h-9"
          >
            {entries.map((item, index) => {
              const selected = index === active;
              const barWidth = item.width * width;
              const showDuration = barWidth >= SHOW_DURATION;
              const showName = barWidth >= SHOW_NAME;

              return (
                <button
                  key={item.company}
                  ref={(node) => {
                    bars.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`${idBase}-tab-${index}`}
                  aria-controls={`${idBase}-panel`}
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  aria-label={`${item.company} — ${item.role}, ${item.range}`}
                  className={cn(
                    "absolute top-0 flex h-9 items-center gap-2 overflow-hidden rounded-full",
                    "cursor-pointer transition-colors duration-200 ease-out",
                    /* The strip's edges are masked, so a bar scrolled "just
                       visible" is still under the fade. */
                    "scroll-mx-10 md:scroll-mx-28",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    showDuration ? "px-3" : "justify-center px-0",
                    selected
                      ? "bg-emerald-100 dark:bg-emerald-400/20"
                      : "bg-card hover:bg-accent",
                  )}
                  style={{
                    left: `${item.offset * 100}%`,
                    width: `calc(${item.width * 100}% - 4px)`,
                  }}
                >
                  <Image
                    src={item.logo.url}
                    alt=""
                    width={20}
                    height={20}
                    className={cn(
                      "size-5 shrink-0 rounded-[5px] object-cover",
                      "transition-opacity duration-200 ease-out",
                      selected ? "opacity-100" : "opacity-75",
                    )}
                  />

                  {showName && (
                    <span className="min-w-0 flex-1 truncate text-left text-[12px] font-medium text-primary">
                      {item.company}
                    </span>
                  )}

                  {showDuration && (
                    <span
                      className={cn(
                        "shrink-0 text-[12px] tabular-nums",
                        showName ? "text-muted-foreground" : "text-primary",
                      )}
                    >
                      {item.duration}
                    </span>
                  )}

                  {item.current && (
                    <span className="ml-1 size-1.5 shrink-0 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stays put while the strip scrolls, so the detail is always in the same
          place rather than chasing the bar it belongs to. */}
      <div
        id={`${idBase}-panel`}
        role="tabpanel"
        aria-labelledby={`${idBase}-tab-${active}`}
        className="mt-7 min-h-12"
      >
        {entry && (
          <motion.div
            key={entry.company}
            initial="hidden"
            animate="shown"
            /* The lines arrive a beat apart, so a change down here is caught
               out of the corner of the eye while the cursor is up on a bar. */
            variants={{ shown: { transition: { staggerChildren: 0.05 } } }}
            className="flex flex-col gap-1"
          >
            <motion.div variants={line} className="flex items-baseline gap-3">
              <h3 className="text-[15px] font-medium leading-snug text-primary">
                {entry.role}
              </h3>

              <a
                href={entry.url}
                target="_blank"
                rel="noreferrer"
                className="group ml-auto inline-flex shrink-0 items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-primary"
              >
                {entry.company}
                <ArrowUpRight
                  aria-hidden
                  className="size-3.5 shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </motion.div>

            <motion.p
              variants={line}
              className="text-xs tabular-nums text-muted-foreground"
            >
              {entry.range}
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExperienceTimeline;
