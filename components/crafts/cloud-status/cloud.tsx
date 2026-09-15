"use client";

import {
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  animate,
  motion,
  type MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

type Spring = { stiffness: number; damping: number };
type Timing = { in: number; out: number };

const AVATAR = 56;

/**
 * Every shape is placed from the avatar's centre, y growing downward as in SVG.
 * `BODY` is the bottom-left corner of the text - the corner the tail grows from.
 */
const BODY = { x: 44, y: -60 };

/** The thought trail. Each puff knows where it goes to become part of the tail. */
const PUFFS = [
  {
    x: 24,
    y: -30,
    r: 5,
    tail: { x: BODY.x - 3, y: BODY.y + 3, r: 6 },
    timing: { in: 0, out: 0.16 },
  },
  {
    x: 36,
    y: -45,
    r: 7,
    tail: { x: BODY.x + 7, y: BODY.y - 7, r: 10 },
    timing: { in: 0.06, out: 0.12 },
  },
] as const;

const CLOSE: Spring = { stiffness: 380, damping: 36 };

/** Distance a shape rises while it condenses. */
const RISE = 5;
/** Haze the whole cloud starts in, and evaporates back into. */
const MIST = 3;
const SHADOW_BLUR = 10;

/** Content sits exactly over the body, which is measured off it. */
const CONTENT_LEFT = AVATAR / 2 + BODY.x;
const CONTENT_BOTTOM = AVATAR / 2 - BODY.y;
/** Room around the text for the crown and the right-hand billow. */
const HEADROOM = 36;
const SIDEROOM = 24;

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
const clamp = (t: number, min = 0, max = 1) => Math.min(Math.max(t, min), max);

type BumpSpec = {
  x: number;
  y: number;
  r: number;
  phase: number;
  timing: Timing;
};

/**
 * Billows for a w×h text box, in its own coordinates. A puffy domed top, a
 * flatter scalloped bottom and a round billow at each end - overlapping enough
 * that no straight edge of the core ever reaches the outline. Counts follow
 * the width, so a longer status gets more billows instead of stretched ones.
 */
function cloudBumps(w: number, h: number): BumpSpec[] {
  if (!w || !h) return [];

  const bumps: Array<{ x: number; y: number; r: number }> = [];

  const top = Math.max(3, Math.round(w / 52));
  const topStep = (w * 0.74) / (top - 1);
  for (let i = 0; i < top; i++) {
    /** Crests a little left of centre, so the cloud isn't a mirror image. */
    const dome = Math.sin(Math.PI * (i / (top - 1)) ** 0.85);
    const r = topStep * (0.5 + 0.3 * dome) + (i % 2 ? -2 : 2);
    bumps.push({ x: w * 0.12 + i * topStep, y: r * 0.55 - dome * 10, r });
  }

  const bottom = Math.max(2, Math.round(w / 70));
  const bottomStep = (w * 0.6) / (bottom - 1);
  for (let i = 0; i < bottom; i++) {
    const r = bottomStep * 0.42 + (i % 2 ? 2 : 0);
    bumps.push({ x: w * 0.18 + i * bottomStep, y: h - r * 0.72, r });
  }

  bumps.push({ x: 6, y: h * 0.58, r: h * 0.5 });
  bumps.push({ x: w - 6, y: h * 0.5, r: h * 0.48 });

  /** Billows roll out from the corner the trail arrives at, and roll back into it. */
  return bumps.map((bump, i) => {
    const wave = Math.hypot(bump.x, h - bump.y) / Math.hypot(w, h);
    return {
      ...bump,
      phase: i * 1.7,
      timing: { in: 0.1 + wave * 0.2, out: (1 - wave) * 0.06 },
    };
  });
}

function roundedRect(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  bottomLeft: number,
) {
  const cap = Math.max(Math.min(width, height) / 2, 0);
  const r = clamp(radius, 0, cap);
  const bl = clamp(bottomLeft, 0, cap);

  return [
    `M${x + r},${y}`,
    `H${x + width - r}`,
    `A${r},${r} 0 0 1 ${x + width},${y + r}`,
    `V${y + height - r}`,
    `A${r},${r} 0 0 1 ${x + width - r},${y + height}`,
    `H${x + bl}`,
    `A${bl},${bl} 0 0 1 ${x},${y + height - bl}`,
    `V${y + r}`,
    `A${r},${r} 0 0 1 ${x + r},${y}`,
    "Z",
  ].join(" ");
}

/**
 * 0 → 1 as a shape condenses; staggered in, and in reverse on the way out.
 * The default spring arrives near critical.
 */
function usePresence(
  open: boolean,
  timing: Timing,
  spring: Spring = { stiffness: 220, damping: 22 },
) {
  const reduced = useReducedMotion();
  const value = useMotionValue(0);

  useEffect(() => {
    const controls = animate(
      value,
      open ? 1 : 0,
      reduced
        ? { duration: 0.2, ease: "easeOut" }
        : {
            type: "spring",
            ...(open ? spring : CLOSE),
            delay: open ? timing.in : timing.out,
          },
    );
    return () => controls.stop();
    // Springs and timings are static per shape.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, value, reduced]);

  return value;
}

type ShapeProps = {
  open: boolean;
  morph: MotionValue<number>;
  /** Seconds, ticking only while the cloud is up - the cloud breathes on it. */
  time: MotionValue<number>;
};

type SizeProps = { w: number; h: number };

function Puff({ index, open, morph, time }: ShapeProps & { index: 0 | 1 }) {
  const puff = PUFFS[index];
  const reduced = useReducedMotion();
  const presence = usePresence(open, puff.timing);

  const cx = useTransform(morph, (m) => lerp(puff.x, puff.tail.x, m));
  const cy = useTransform([presence, morph, time], ([p, m, t]: number[]) =>
    reduced
      ? lerp(puff.y, puff.tail.y, m)
      : lerp(puff.y, puff.tail.y, m) +
        (1 - clamp(p)) * RISE +
        Math.sin(t * 1.3 + index * 2) * 1.2 * clamp(p) * clamp(1 - m),
  );
  const r = useTransform([presence, morph], ([p, m]: number[]) =>
    Math.max(lerp(puff.r, puff.tail.r, m) * p, 0),
  );

  return <motion.circle cx={cx} cy={cy} r={r} />;
}

/** The solid middle: tucked 10px inside the billows as a cloud, the whole bubble as a message. */
function Core({ open, morph, w, h }: Omit<ShapeProps, "time"> & SizeProps) {
  /** Unrolls at the pace of the billows, so it never shows as a bare pill. */
  const presence = usePresence(
    open,
    { in: 0.16, out: 0.08 },
    { stiffness: 130, damping: 18 },
  );

  /** Grows out of its own left cap, the end nearest the trail. */
  const d = useTransform([presence, morph], ([p, m]: number[]) => {
    if (!w || !h) return "M0,0";

    const s = Math.max(p, 0);
    const inset = lerp(10, 0, clamp(m, 0, 1.2));
    const half = h / 2 - inset;
    const cap = half * s;

    return roundedRect(
      BODY.x + inset + half - cap,
      BODY.y - h + inset + half - cap,
      (w - inset * 2) * s,
      cap * 2,
      lerp(cap, Math.min(cap, 20), m),
      lerp(cap, Math.min(cap, 5), m),
    );
  });

  return <motion.path d={d} />;
}

function Billow({
  bump,
  open,
  morph,
  time,
  w,
  h,
}: ShapeProps & SizeProps & { bump: BumpSpec }) {
  const reduced = useReducedMotion();
  /** Looser than the rest - each billow swells about a tenth past its size. */
  const presence = usePresence(open, bump.timing, {
    stiffness: 240,
    damping: 18,
  });

  /** How far out of the body it is: pushed by presence, pulled back in by the morph. */
  const out = useTransform([presence, morph], ([p, m]: number[]) =>
    Math.max(p * (1 - m), 0),
  );

  /** A hidden billow sits straight in from its spot, on the text's midline. */
  const cx = useTransform(out, (o) =>
    lerp(BODY.x + clamp(bump.x, h / 2, w - h / 2), BODY.x + bump.x, o),
  );
  const cy = useTransform([out, time], ([o, t]: number[]) =>
    reduced
      ? lerp(BODY.y - h / 2, BODY.y - h + bump.y, o)
      : lerp(BODY.y - h / 2, BODY.y - h + bump.y, o) +
        Math.sin(t * 1.1 + bump.phase) * 0.8 * clamp(o) +
        (1 - clamp(o)) * RISE,
  );
  const r = useTransform([out, time], ([o, t]: number[]) => {
    const breath = reduced ? 0 : Math.sin(t * 1.5 + bump.phase) * 0.035;
    return Math.max(bump.r * o * (1 + breath * clamp(o)), 0);
  });

  return <motion.circle cx={cx} cy={cy} r={r} />;
}

export type BubbleVariant = "thought" | "message";

export type StatusUser = {
  name: string;
  avatar: ReactNode;
};

type Props = {
  user: StatusUser;
  status: ReactNode;
  /** A thought drifts up in a cloud; a message is a bubble with a tail. */
  variant?: BubbleVariant;
  className?: string;
};

export default function CloudStatus({
  user,
  status,
  variant = "thought",
  className,
}: Props) {
  const filterId = useId().replace(/:/g, "");
  const statusId = useId();
  const reduced = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<SVGFEGaussianBlurElement>(null);
  const pointer = useRef("mouse");
  const leaveTimer = useRef<number | null>(null);

  const [open, setOpen] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const message = variant === "message";

  const bumps = useMemo(() => cloudBumps(size.w, size.h), [size.w, size.h]);

  /**
   * 0 is a thought, 1 is a message. Every shape reads it, so both bubbles are
   * the same shapes in different places. Switching while it's up morphs one
   * into the other; while it's down there's nothing to watch, so it just jumps.
   */
  const morph = useMotionValue(message ? 1 : 0);
  useEffect(() => {
    if (!open) {
      morph.jump(message ? 1 : 0);
      return;
    }
    /** The tail lands with a little slosh. */
    const controls = animate(
      morph,
      message ? 1 : 0,
      reduced
        ? { duration: 0.2, ease: "easeOut" }
        : { type: "spring", stiffness: 240, damping: 18 },
    );
    return () => controls.stop();
    // Only a change of variant should morph - opening and closing must not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, morph, reduced]);

  const text = usePresence(open, { in: 0.26, out: 0 });
  const textFilter = useTransform(text, (t) =>
    reduced ? "none" : `blur(${(1 - clamp(t)) * 6}px)`,
  );
  const textY = useTransform(text, (t) => (reduced ? 0 : (1 - t) * 4));

  /** 1 is haze, 0 is a crisp edge. Condenses slowly, evaporates quickly. */
  const mist = useMotionValue(1);
  useEffect(() => {
    if (reduced) {
      mist.jump(0);
      return;
    }
    const controls = animate(
      mist,
      open ? 0 : 1,
      open
        ? { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
        : { duration: 0.25, ease: "easeIn" },
    );
    return () => controls.stop();
  }, [open, mist, reduced]);

  useMotionValueEvent(mist, "change", (value) => {
    mistRef.current?.setAttribute("stdDeviation", String(value * MIST));
  });

  /** A slow clock for the breathing, stopped whenever nothing is on screen. */
  const time = useMotionValue(0);
  useEffect(() => {
    if (!open || reduced) return;

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      time.set(time.get() + (now - last) / 1000);
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, reduced, time]);

  /** The billows are sized to the text, so the text is measured, never guessed. */
  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const measure = () =>
      setSize({ w: node.offsetWidth, h: node.offsetHeight });

    measure();
    document.fonts?.ready.then(measure).catch(() => {});

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /** Touch has no leave, so a tap anywhere else lets the cloud go. */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(
    () => () => {
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    },
    [],
  );

  const hold = () => {
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    leaveTimer.current = null;
  };

  const height = CONTENT_BOTTOM + size.h + HEADROOM;

  return (
    <div
      ref={rootRef}
      onPointerDown={(event) => (pointer.current = event.pointerType)}
      onPointerEnter={hold}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        hold();
        /** Grace for the pointer to cross from the avatar to the cloud. */
        leaveTimer.current = window.setTimeout(() => setOpen(false), 160);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
      onBlur={(event) => {
        /** A tap on the cloud blurs the avatar with nowhere to go - that's not leaving. */
        const next = event.relatedTarget;
        if (next && !event.currentTarget.contains(next)) setOpen(false);
      }}
      style={{ width: CONTENT_LEFT + size.w + SIDEROOM, height }}
      className={cn(
        "relative isolate",
        /** Inverted against the theme: ink on light, paper on dark. */
        "[--cloud-fill:hsl(var(--primary))] [--cloud-shadow:rgba(0,0,0,0.16)]",
        "dark:[--cloud-shadow:rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <svg
        aria-hidden
        focusable="false"
        className="pointer-events-none absolute inset-0 -z-10 size-full overflow-visible"
      >
        <defs>
          <filter
            id={filterId}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
            x={-AVATAR}
            y={BODY.y - size.h - HEADROOM - SHADOW_BLUR * 3}
            width={BODY.x + size.w + SIDEROOM + AVATAR * 2}
            height={size.h + HEADROOM - BODY.y + AVATAR + SHADOW_BLUR * 3}
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={3.5}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
              result="goo"
            />
            {/* Goo only adds the bridges; the shapes keep their own round edges. */}
            <feMerge result="shape">
              <feMergeNode in="goo" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
            <feDropShadow
              in="shape"
              dx="0"
              dy={6}
              stdDeviation={SHADOW_BLUR}
              style={{ floodColor: "var(--cloud-shadow)" }}
              result="lit"
            />
            <feGaussianBlur
              ref={mistRef}
              in="lit"
              stdDeviation={reduced ? 0 : MIST}
            />
          </filter>
        </defs>

        <g transform={`translate(${AVATAR / 2} ${height - AVATAR / 2})`}>
          <g filter={`url(#${filterId})`} style={{ fill: "var(--cloud-fill)" }}>
            <Puff index={0} open={open} morph={morph} time={time} />
            <Puff index={1} open={open} morph={morph} time={time} />
            <Core open={open} morph={morph} {...size} />
            {bumps.map((bump, index) => (
              <Billow
                key={index}
                bump={bump}
                open={open}
                morph={morph}
                time={time}
                {...size}
              />
            ))}
          </g>
        </g>
      </svg>

      <button
        type="button"
        aria-label={`${user.name}'s status`}
        aria-expanded={open}
        aria-describedby={statusId}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          hold();
          setOpen(true);
        }}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) setOpen(true);
        }}
        onClick={(event) => {
          /** Mouse already opened it on hover; touch and keyboard toggle. */
          if (event.detail > 0 && pointer.current === "mouse") return;
          setOpen((current) => !current);
        }}
        style={{ width: AVATAR, height: AVATAR }}
        className={cn(
          "absolute bottom-0 left-0 cursor-pointer rounded-full",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        )}
      >
        <span className="block size-full overflow-hidden rounded-full bg-secondary ring-1 ring-border dark:ring-0">
          {user.avatar}
        </span>
        <span
          aria-hidden
          className="absolute right-0.5 bottom-0.5 size-3 rounded-full bg-emerald-500 ring-[2.5px] ring-card"
        />
      </button>

      <motion.div
        ref={contentRef}
        id={statusId}
        aria-hidden={!open}
        style={{
          left: CONTENT_LEFT,
          bottom: CONTENT_BOTTOM,
          opacity: text,
          filter: textFilter,
          y: textY,
        }}
        className={cn(
          "pointer-events-none absolute w-max max-w-56 select-none px-5 py-3",
          "text-[13px] font-medium leading-5 tracking-[-0.005em] text-balance",
          "transition-colors duration-300 ease-out",
          /** A thought is still half-formed; a message is said out loud. */
          message ? "text-primary-foreground" : "text-primary-foreground/65",
        )}
      >
        {status}
      </motion.div>
    </div>
  );
}
