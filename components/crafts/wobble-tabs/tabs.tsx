"use client";

import { useEffect, useRef, useState } from "react";

import { Compass, Library, type LucideIcon, UserRound } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

/** A collapsed pill is a circle, so its width is its height. */
const COLLAPSED = 44;
const ICON = 19;
const GAP = 8;

/** 16.5% overshoot peaking at 270ms in the reference: damping ratio 0.50 at 14 rad/s. */
const SPRING = { stiffness: 200, damping: 14.1 };
/** Slow motion divides the frequency, so the curve keeps its exact shape. */
const SLOW = 4;

const TABS: ReadonlyArray<{
  id: string;
  label: string;
  Icon: LucideIcon;
  accent: string;
}> = [
  {
    id: "discover",
    label: "Discover",
    Icon: Compass,
    accent: "[--tab-accent:#A78BFA]",
  },
  {
    id: "library",
    label: "Library",
    Icon: Library,
    accent: "[--tab-accent:#34D399]",
  },
  {
    id: "profile",
    label: "Profile",
    Icon: UserRound,
    accent: "[--tab-accent:#FBBF24]",
  },
];

const labelClass = "text-[16px] font-semibold leading-none tracking-[-0.01em]";

type PillProps = {
  tab: (typeof TABS)[number];
  active: boolean;
  slow: boolean;
  labelWidth: number;
  onSelectAction: () => void;
  ref: (node: HTMLButtonElement | null) => void;
};

const Pill = ({
  tab,
  active,
  slow,
  labelWidth,
  onSelectAction,
  ref,
}: PillProps) => {
  const shouldReduceMotion = useReducedMotion();

  /** One spring: the pill's width, the label's room, its fade and its blur are all reads of it. */
  const open = useMotionValue(active ? 1 : 0);

  /** 16px of padding either side of the icon-and-label group. */
  const expanded = 32 + ICON + GAP + labelWidth;
  const width = useTransform(
    open,
    (v) => COLLAPSED + v * (expanded - COLLAPSED),
  );
  const room = useTransform(open, (v) => Math.max(v * (GAP + labelWidth), 0));
  const opacity = useTransform(open, [0, 0.45, 1], [0, 0.08, 1]);
  const filter = useTransform(open, (v) =>
    shouldReduceMotion ? "none" : `blur(${Math.max((1 - v) * 8, 0)}px)`,
  );

  useEffect(() => {
    const controls = animate(
      open,
      active ? 1 : 0,
      shouldReduceMotion
        ? { type: "spring", stiffness: 420, damping: 40 }
        : {
            type: "spring",
            stiffness: SPRING.stiffness / (slow ? SLOW * SLOW : 1),
            damping: SPRING.damping / (slow ? SLOW : 1),
          },
    );
    return () => controls.stop();
  }, [active, open, shouldReduceMotion, slow]);

  return (
    <motion.button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={active}
      tabIndex={active ? 0 : -1}
      onClick={onSelectAction}
      style={{ width }}
      className={cn(
        tab.accent,
        "relative flex h-11 shrink-0 cursor-pointer items-center justify-center",
        "overflow-hidden rounded-full bg-[#131316] dark:bg-[#242429]",
        "shadow-[0_1px_2px_rgba(0,0,0,0.10),0_6px_16px_rgba(0,0,0,0.14)]",
        "dark:shadow-[0_1px_2px_rgba(0,0,0,0.6),0_6px_16px_rgba(0,0,0,0.45)]",
        "transition-[box-shadow,translate] duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        !active &&
          "hover:-translate-y-0.5 hover:shadow-[0_2px_6px_rgba(0,0,0,0.12),0_12px_26px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_2px_6px_rgba(0,0,0,0.7),0_12px_28px_rgba(0,0,0,0.55)]",
      )}
    >
      <span className="flex items-center">
        <tab.Icon
          size={ICON}
          strokeWidth={2.4}
          aria-hidden
          className={cn(
            "shrink-0 transition-colors duration-300 ease-out",
            active ? "text-[var(--tab-accent)]" : "text-[#F4F4F5]",
          )}
        />
        <motion.span style={{ width: room }} className="overflow-hidden">
          <motion.span
            style={{ opacity, filter, paddingLeft: GAP }}
            className={cn(
              labelClass,
              "block whitespace-nowrap text-[var(--tab-accent)]",
            )}
          >
            {tab.label}
          </motion.span>
        </motion.span>
      </span>
    </motion.button>
  );
};

type Props = {
  value: number;
  onValueChangeAction: (index: number) => void;
  slow?: boolean;
};

export default function WobbleTabs({
  value,
  onValueChangeAction,
  slow = false,
}: Props) {
  const ghosts = useRef<Array<HTMLSpanElement | null>>([]);
  const pills = useRef<Array<HTMLButtonElement | null>>([]);
  const [labelWidths, setLabelWidths] = useState<number[]>(() =>
    TABS.map(() => 0),
  );

  /** Labels are measured, never guessed — a font swap changes the answer. */
  useEffect(() => {
    const measure = () =>
      setLabelWidths(
        ghosts.current.map((node) =>
          node ? Math.ceil(node.getBoundingClientRect().width) : 0,
        ),
      );

    measure();
    document.fonts?.ready.then(measure).catch(() => {});

    const observer = new ResizeObserver(measure);
    ghosts.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: value + 1,
      ArrowDown: value + 1,
      ArrowLeft: value - 1,
      ArrowUp: value - 1,
      Home: 0,
      End: TABS.length - 1,
    };
    if (moves[event.key] === undefined) return;

    event.preventDefault();
    const index = (moves[event.key] + TABS.length) % TABS.length;
    onValueChangeAction(index);
    pills.current[index]?.focus({ preventScroll: true });
  };

  return (
    <div
      role="radiogroup"
      aria-label="Section"
      onKeyDown={onKeyDown}
      className="relative flex items-center gap-2"
    >
      {/* Off-layout copies of the labels, at their natural width. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 flex"
        style={{ visibility: "hidden" }}
      >
        {TABS.map((tab, index) => (
          <span
            key={tab.id}
            ref={(node) => {
              ghosts.current[index] = node;
            }}
            className={cn(labelClass, "whitespace-nowrap")}
          >
            {tab.label}
          </span>
        ))}
      </div>

      {TABS.map((tab, index) => (
        <Pill
          key={tab.id}
          tab={tab}
          active={index === value}
          slow={slow}
          labelWidth={labelWidths[index] ?? 0}
          onSelectAction={() => onValueChangeAction(index)}
          ref={(node) => {
            pills.current[index] = node;
          }}
        />
      ))}
    </div>
  );
}
