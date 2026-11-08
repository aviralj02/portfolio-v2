"use client";

import { type KeyboardEvent, useLayoutEffect, useRef, useState } from "react";

import {
  Bookmark,
  House,
  type LucideIcon,
  MessageCircle,
  User,
} from "lucide-react";
import { motion, MotionConfig } from "motion/react";

import { cn } from "@/lib/utils";

type Tab = { id: string; label: string; icon: LucideIcon; badge?: number };

const TABS: Array<Tab> = [
  { id: "home", label: "Home", icon: House },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "inbox", label: "Inbox", icon: MessageCircle, badge: 2 },
  { id: "profile", label: "Profile", icon: User },
];

const TAB = 44;
const PAD = 4;
const LABEL_LEFT = 40;
const LABEL_RIGHT = 16;
const STRETCH = 6;
const LABEL_SHIFT = 8;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const MOVE = { duration: 0.35, ease: EASE_OUT };
// The pill's edges ease differently: the leading edge shoots to the new tab,
// while the trailing edge starts slow, holds the old tab a beat, then lets go.
const LEAD = { duration: 0.3, ease: EASE_OUT };
const TRAIL = { duration: 0.38, ease: [0.7, 0, 0.2, 1] as const };
const SLOW = 5;

type Timing = { duration: number; delay?: number };
const slowed = <T extends Timing>(t: T, by: number): T => ({
  ...t,
  duration: t.duration * by,
  delay: (t.delay ?? 0) * by,
});

export default function SwitchTabs() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [enterFrom, setEnterFrom] = useState(1);
  const [hovered, setHovered] = useState<number | null>(null);
  const [slow, setSlow] = useState(false);
  const [labelWidths, setLabelWidths] = useState<Array<number> | null>(null);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const labelsRef = useRef<Array<HTMLSpanElement | null>>([]);

  useLayoutEffect(() => {
    document.fonts.ready.then(() => {
      setLabelWidths(labelsRef.current.map((el) => el?.offsetWidth ?? 0));
    });
  }, []);

  const widths = TABS.map((_, i) =>
    i === active && labelWidths
      ? LABEL_LEFT + labelWidths[i] + LABEL_RIGHT
      : TAB,
  );
  const pillX = widths.slice(0, active).reduce((sum, w) => sum + w, 0);
  const lean =
    hovered === null || hovered === active ? 0 : Math.sign(hovered - active);
  const total = widths.reduce((sum, w) => sum + w, 0);
  const pillLeft = PAD + pillX - (lean < 0 ? STRETCH : 0);
  const pillRight =
    PAD + total - pillX - widths[active] - (lean > 0 ? STRETCH : 0);

  const by = slow ? SLOW : 1;
  const colorTiming = { transitionDuration: `${300 * by}ms` };

  const select = (i: number) => {
    const step = Math.sign(i - active);
    if (step) {
      setDirection(step);
      setEnterFrom(step);
    }
    setActive(i);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + TABS.length) % TABS.length;
    select(next);
    buttonsRef.current[next]?.focus();
  };

  return (
    <MotionConfig reducedMotion="user" transition={slowed(MOVE, by)}>
      <div className="flex w-full grow flex-col items-center justify-end gap-8">
        <div className="flex grow items-center">
          <div
            role="tablist"
            aria-label="Sections"
            onKeyDown={handleKeyDown}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "relative flex rounded-full bg-muted p-1 shadow-[inset_0_1px_2px_rgb(0_0_0/0.06)] transition-opacity",
              !labelWidths && "opacity-0",
            )}
          >
            <motion.span
              aria-hidden
              initial={false}
              animate={{ left: pillLeft, right: pillRight }}
              transition={{
                left: slowed(direction > 0 ? TRAIL : LEAD, by),
                right: slowed(direction > 0 ? LEAD : TRAIL, by),
              }}
              className="absolute inset-y-1 rounded-full bg-foreground shadow-[0_1px_2px_rgb(0_0_0/0.1),0_4px_12px_-4px_rgb(0_0_0/0.25)]"
            />

            {TABS.map((tab, i) => {
              const selected = i === active;
              const Icon = tab.icon;

              return (
                <motion.button
                  key={tab.id}
                  ref={(el) => {
                    buttonsRef.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={
                    tab.badge ? `${tab.label}, ${tab.badge} unread` : tab.label
                  }
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  onMouseEnter={() => {
                    setHovered(i);
                    if (i !== active) setDirection(Math.sign(i - active));
                  }}
                  initial={false}
                  animate={{ width: widths[i] }}
                  style={colorTiming}
                  className={cn(
                    "relative flex h-10 shrink-0 cursor-pointer items-center rounded-full pl-3 text-sm font-medium outline-none transition-colors [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-foreground/20",
                    selected
                      ? "text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <motion.span
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="relative grid size-5 place-items-center"
                  >
                    <Icon
                      className="size-4.5 transition-[fill-opacity]"
                      style={colorTiming}
                      strokeWidth={2}
                      fill="currentColor"
                      fillOpacity={selected ? 1 : 0}
                    />
                    {tab.badge && (
                      <span
                        style={colorTiming}
                        className={cn(
                          "absolute -top-1.5 -right-1 grid size-3.5 place-items-center rounded-full text-[9px] leading-none font-semibold tabular-nums ring-2 transition-colors",
                          selected
                            ? "bg-background text-foreground ring-foreground"
                            : "bg-foreground text-background ring-muted",
                        )}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </motion.span>
                </motion.button>
              );
            })}

            {TABS.map((tab, i) => (
              <motion.span
                key={tab.id}
                ref={(el) => {
                  labelsRef.current[i] = el;
                }}
                aria-hidden
                initial={false}
                animate={
                  i === active
                    ? {
                        opacity: 1,
                        filter: "blur(0px)",
                        x: [-LABEL_SHIFT * enterFrom, 0],
                      }
                    : { opacity: 0, filter: "blur(4px)", x: 0 }
                }
                transition={
                  i === active
                    ? slowed(
                        { duration: 0.25, ease: EASE_OUT, delay: 0.08 },
                        by,
                      )
                    : slowed({ duration: 0.1 }, by)
                }
                style={{ left: PAD + i * TAB + LABEL_LEFT }}
                className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-sm font-medium whitespace-nowrap text-background"
              >
                {tab.label}
              </motion.span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSlow((prev) => !prev)}
          aria-pressed={slow}
          className={cn(
            "cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:outline-none",
            slow
              ? "bg-foreground text-background"
              : "bg-foreground/10 text-foreground/70 hover:bg-foreground/15 hover:text-foreground",
          )}
        >
          Slow motion: {slow ? "On" : "Off"}
        </button>
      </div>
    </MotionConfig>
  );
}
