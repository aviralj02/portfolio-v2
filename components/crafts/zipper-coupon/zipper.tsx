"use client";

import {
  motion,
  type MotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

import { cn } from "@/lib/utils";

export const WIDTH = 288;
export const HEIGHT = 168;
const MID = HEIGHT / 2;
const PITCH = 8;
const CURVE = 2.2;
const TEETH = Array.from(
  { length: WIDTH / PITCH - 3 },
  (_, i) => 12 + i * PITCH,
);

type Side = -1 | 1;

const gap = (d: number) =>
  d <= 0
    ? 0
    : (MID * (Math.exp((CURVE * d) / WIDTH) - 1)) / (Math.exp(CURVE) - 1);

const slope = (d: number) =>
  d <= 0
    ? 0
    : (MID * CURVE * Math.exp((CURVE * d) / WIDTH)) /
      (WIDTH * (Math.exp(CURVE) - 1));

const edge = (p: number, side: Side) =>
  Array.from({ length: 25 }, (_, i) => {
    const x = p * (1 - i / 24);
    return `${x}px ${MID + side * gap(p - x)}px`;
  }).join(", ");

function Tooth({
  pull,
  x,
  side,
}: {
  pull: MotionValue<number>;
  x: number;
  side: Side;
}) {
  const y = useTransform(pull, (p) => side * gap(p - x));
  const rotate = useTransform(
    pull,
    (p) => (-side * Math.atan(slope(p - x)) * 180) / Math.PI,
  );

  return (
    <motion.span
      style={{ left: x, top: side === -1 ? MID - 5 : MID - 1, y, rotate }}
      className="absolute size-1.5 rounded-[2px] bg-linear-to-b from-zinc-100 to-zinc-400 shadow-[0_1px_1px_rgb(0_0_0/0.3)]"
    />
  );
}

function Cover() {
  return (
    <div className="relative size-full rounded-2xl bg-primary text-primary-foreground">
      <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(160deg,rgb(255_255_255/0.12),transparent_45%)]" />
      <div className="absolute inset-2 rounded-xl border border-dashed border-primary-foreground/20" />
      <div className="relative flex size-full flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase opacity-60">
            Coupon
          </p>
          <p className="font-mono text-[10px] opacity-50">No. 0042</p>
        </div>
        <p className="text-right text-sm font-medium">
          Something&apos;s inside
        </p>
      </div>
    </div>
  );
}

export function Lining({ opened }: { opened: boolean }) {
  return (
    <motion.div
      animate={{ opacity: opened ? 0 : 1, scale: opened ? 0.9 : 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="absolute inset-px rounded-2xl bg-orange-500 bg-[repeating-linear-gradient(45deg,rgb(255_255_255/0.12)_0_2px,transparent_2px_9px)] shadow-[inset_0_0_28px_rgb(0_0_0/0.55)]"
    />
  );
}

export function Half({
  pull,
  side,
  opened,
}: {
  pull: MotionValue<number>;
  side: Side;
  opened: boolean;
}) {
  const clipPath = useTransform(pull, (p) =>
    side === -1
      ? `polygon(0 0, 100% 0, 100% ${MID}px, ${edge(p, -1)})`
      : `polygon(${edge(p, 1)}, 0 100%, 100% 100%, 100% ${MID}px)`,
  );

  return (
    <motion.div
      animate={
        opened
          ? { y: side * MID, rotate: side * 4, opacity: 0 }
          : { y: 0, opacity: 1 }
      }
      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      className={cn(
        "pointer-events-none absolute inset-0",
        side === -1
          ? "drop-shadow-[0_3px_4px_rgb(0_0_0/0.3)]"
          : "drop-shadow-[0_-2px_4px_rgb(0_0_0/0.25)]",
      )}
    >
      <motion.div style={{ clipPath }} className="absolute inset-0">
        <Cover />
      </motion.div>
      {TEETH.map((x) => (
        <Tooth
          key={x}
          pull={pull}
          x={side === -1 ? x : x + PITCH / 2}
          side={side}
        />
      ))}
    </motion.div>
  );
}

export function Pull({
  pull,
  opened,
  onRelease,
}: {
  pull: MotionValue<number>;
  opened: boolean;
  onRelease: () => void;
}) {
  const swing = useSpring(
    useTransform(useVelocity(pull), [-1000, 1000], [-35, 35]),
    { stiffness: 260, damping: 10 },
  );

  return (
    <motion.div
      drag={opened ? false : "x"}
      dragConstraints={{ left: 0, right: WIDTH }}
      dragElastic={0}
      dragMomentum={false}
      onDragEnd={onRelease}
      animate={{ opacity: opened ? 0 : 1, scale: opened ? 0.6 : 1 }}
      whileHover={{ scale: 1.08 }}
      whileDrag={{ scale: 1.12 }}
      style={{ x: pull, top: MID - 9 }}
      aria-label="Zipper pull"
      className={cn(
        "absolute -left-3.5 z-10 h-4.5 w-7 cursor-grab touch-none active:cursor-grabbing",
        opened && "pointer-events-none",
      )}
    >
      <motion.div
        style={{ rotate: swing }}
        className="absolute top-3 left-2 flex h-7 w-3 origin-top items-end justify-center rounded-t-sm rounded-b-[6px] bg-linear-to-b from-zinc-200 to-zinc-400 pb-1.5 shadow-[0_3px_6px_rgb(0_0_0/0.35),inset_0_1px_0_rgb(255_255_255/0.7)]"
      >
        <span className="h-2.5 w-1 rounded-full bg-zinc-600/50 shadow-[inset_0_1px_1px_rgb(0_0_0/0.4)]" />
      </motion.div>

      <div className="relative size-full rounded-[5px] bg-linear-to-b from-zinc-50 to-zinc-400 shadow-[0_2px_5px_rgb(0_0_0/0.35),inset_0_1px_0_rgb(255_255_255/0.9)]" />
    </motion.div>
  );
}
