"use client";

import {
  createContext,
  type CSSProperties,
  type ReactNode,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  animate,
  frame,
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type ValueAnimationTransition,
} from "motion/react";

import { cn } from "@/lib/utils";

const REVEAL: ValueAnimationTransition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
};
const TRACK: ValueAnimationTransition = {
  type: "spring",
  stiffness: 900,
  damping: 60,
};
const REDUCED: ValueAnimationTransition = { duration: 0.25, ease: "easeOut" };

const GOO_BLUR = 8;
const FILL = "var(--liquid-fill, hsl(var(--card)))";
const RING = "var(--liquid-ring, hsl(var(--border)))";
const SHADOW =
  "drop-shadow(0 10px 24px var(--liquid-shadow, rgba(0, 0, 0, 0.1)))";

type LiquidContextValue = {
  gap: number;
  radius: number;
  debug: boolean;
  distance: MotionValue<number>;
  bottom: MotionValue<string>;
  attachmentHeight: number;
  setAttachmentHeight: (height: number) => void;
};

const LiquidContext = createContext<LiquidContextValue | null>(null);

function useLiquid() {
  const value = useContext(LiquidContext);
  if (!value) throw new Error("Liquid parts must be used within <Liquid>.");
  return value;
}

type LiquidProps = {
  children: ReactNode;
  gap?: number;
  radius?: number;
  debug?: boolean;
  className?: string;
};

export default function Liquid({
  children,
  gap = 6,
  radius = 20,
  debug = false,
  className,
}: LiquidProps) {
  const filterId = useId().replace(/:/g, "");
  const distance = useMotionValue(0);
  const [attachmentHeight, setAttachmentHeight] = useState(0);
  const bottom = useTransform(distance, (d) => `calc(100% + ${d}px)`);

  const value = useMemo(
    () => ({
      gap,
      radius,
      debug,
      distance,
      bottom,
      attachmentHeight,
      setAttachmentHeight,
    }),
    [gap, radius, debug, distance, bottom, attachmentHeight],
  );

  const shapeClass = debug
    ? "bg-sky-500/15 outline-1 outline-dashed outline-sky-500/70"
    : "bg-(--liquid-surface)";

  return (
    <LiquidContext.Provider value={value}>
      <div
        className={cn("relative isolate", className)}
        style={{ "--liquid-surface": FILL } as CSSProperties}
      >
        <GooFilter id={filterId} />

        <div
          aria-hidden
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{ filter: debug ? undefined : `url(#${filterId}) ${SHADOW}` }}
        >
          <motion.div
            className={cn("absolute inset-x-0", shapeClass)}
            style={{
              height: attachmentHeight,
              bottom,
              borderRadius: radius,
            }}
          />
          <div
            className={cn("absolute inset-0", shapeClass)}
            style={{ borderRadius: radius }}
          />
        </div>

        {children}
      </div>
    </LiquidContext.Provider>
  );
}

type LiquidAttachmentProps = {
  children: ReactNode;
  show: boolean;
  className?: string;
};

export function LiquidAttachment({
  children,
  show,
  className,
}: LiquidAttachmentProps) {
  const { gap, distance, bottom, attachmentHeight, setAttachmentHeight } =
    useLiquid();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const prevShow = useRef<boolean | null>(null);

  const submerged = useTransform(distance, [-attachmentHeight, 0], [1, 0]);
  const opacity = useTransform(submerged, [0, 0.6, 1], [1, 0.25, 0]);
  const filter = useTransform(
    submerged,
    (s) => `blur(${Math.min(s * 2, 1) * 8}px)`,
  );
  const visibility = useTransform(distance, (d) =>
    d <= -attachmentHeight + 0.5 ? "hidden" : "visible",
  );

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => setAttachmentHeight(node.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [setAttachmentHeight]);

  useLayoutEffect(() => {
    if (!attachmentHeight) return;

    const target = show ? gap : -attachmentHeight;
    const first = prevShow.current === null;
    const revealing = prevShow.current !== show;
    prevShow.current = show;

    if (first) {
      // Deferred a frame so values derived from distance are subscribed first.
      frame.read(() => distance.jump(target));
      return;
    }

    const controls = animate(
      distance,
      target,
      reduced ? REDUCED : revealing ? REVEAL : TRACK,
    );
    return () => controls.stop();
  }, [show, gap, attachmentHeight, distance, reduced]);

  return (
    <motion.div
      ref={ref}
      aria-hidden={!show}
      className={cn("absolute inset-x-0", className)}
      style={{ bottom, opacity, filter, visibility }}
    >
      {children}
    </motion.div>
  );
}

function GooFilter({ id }: { id: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      className="absolute size-0 overflow-hidden"
    >
      <defs>
        <filter
          id={id}
          x="-20%"
          y="-150%"
          width="140%"
          height="400%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={GOO_BLUR}
            result="blur"
          />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11"
            result="goo"
          />
          <feComposite
            in="SourceGraphic"
            in2="goo"
            operator="atop"
            result="fill"
          />
          <feMorphology
            in="fill"
            operator="dilate"
            radius="1"
            result="dilated"
          />
          <feFlood style={{ floodColor: RING }} result="ringColor" />
          <feComposite
            in="ringColor"
            in2="dilated"
            operator="in"
            result="ring"
          />
          <feMerge>
            <feMergeNode in="ring" />
            <feMergeNode in="fill" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
