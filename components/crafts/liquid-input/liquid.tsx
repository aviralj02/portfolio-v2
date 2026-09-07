"use client";

import {
  createContext,
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
const SHADOW_BLUR = 12;
const SHADOW_OFFSET = 10;
const BLEED = GOO_BLUR * 3 + SHADOW_BLUR * 3 + SHADOW_OFFSET;

const FILL = "var(--liquid-fill, hsl(var(--card)))";
const RING = "var(--liquid-ring, hsl(var(--border)))";
const SHADOW = "var(--liquid-shadow, rgba(0, 0, 0, 0.1))";

type LiquidContextValue = {
  gap: number;
  y: MotionValue<number>;
  distance: MotionValue<number>;
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
  const rootRef = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const [attachmentHeight, setAttachmentHeight] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const y = useTransform(distance, (d) => -d);
  const shapeY = useTransform(distance, (d) => -(attachmentHeight + d));

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const update = () =>
      setSize({ width: node.offsetWidth, height: node.offsetHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const value = useMemo(
    () => ({ gap, y, distance, attachmentHeight, setAttachmentHeight }),
    [gap, y, distance, attachmentHeight],
  );

  const headroom = attachmentHeight + Math.max(gap, 0) + BLEED;
  const region = {
    x: -BLEED,
    y: -headroom,
    width: size.width + BLEED * 2,
    height: size.height + headroom + BLEED,
  };

  return (
    <LiquidContext.Provider value={value}>
      <div ref={rootRef} className={cn("relative isolate", className)}>
        <svg
          aria-hidden
          focusable="false"
          className="absolute inset-0 -z-10 size-full overflow-visible pointer-events-none"
        >
          <defs>
            <filter
              id={filterId}
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
              {...region}
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
              <feMerge result="shape">
                <feMergeNode in="ring" />
                <feMergeNode in="fill" />
              </feMerge>
              <feDropShadow
                in="shape"
                dx="0"
                dy={SHADOW_OFFSET}
                stdDeviation={SHADOW_BLUR}
                style={{ floodColor: SHADOW }}
              />
            </filter>
          </defs>

          <g
            filter={debug ? undefined : `url(#${filterId})`}
            style={
              debug
                ? {
                    fill: "rgb(14 165 233 / 0.15)",
                    stroke: "rgb(14 165 233 / 0.7)",
                    strokeDasharray: "4 3",
                  }
                : { fill: FILL }
            }
          >
            <motion.rect
              x={0}
              y={shapeY}
              width="100%"
              height={attachmentHeight}
              rx={radius}
            />
            <rect x={0} y={0} width="100%" height="100%" rx={radius} />
          </g>
        </svg>

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
  const { gap, y, distance, attachmentHeight, setAttachmentHeight } =
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
      style={{ bottom: "100%", y, opacity, filter, visibility }}
    >
      {children}
    </motion.div>
  );
}
