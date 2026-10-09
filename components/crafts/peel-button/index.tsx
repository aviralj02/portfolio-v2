"use client";

import { useEffect, useState } from "react";

import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

const W = 240;
const H = 64;

// Every point of the peel is an offset from the right edge, scaled by how
// far it's open. So `k` squeezes the whole curl flat against that edge at 0
// and lets it out to full size at 1.
const peel = (k: number) => {
  const x = (f: number) => (W - f * W * k).toFixed(2);
  const y = (f: number) => (f * H).toFixed(2);
  const tipY = y(0.8 - 0.23 * Math.min(k, 1));

  // The fold: from the top edge down to the tip of the curl.
  const fold = `M${x(0.1)},0 C${x(0.2)},${y(0.18)} ${x(0.3)},${y(0.42)} ${x(0.37)},${tipY}`;

  return {
    // What's left of the top layer, bulging out under the tip before it
    // meets the bottom edge.
    top: `${fold} C${x(0.31)},${y(0.74)} ${x(0.24)},${H} ${x(0.4)},${H} L0,${H} L0,0 Z`,
    // The underside of the lifted corner. Its lower end tucks under the top layer.
    flap: `${fold} L${x(0.38)},${y(0.96)} L${x(0.3)},${y(0.92)} C${x(0.27)},${y(0.62)} ${x(0.17)},${y(0.22)} ${x(0.1)},0 Z`,
  };
};

export default function PeelButton() {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const reduceMotion = useReducedMotion();

  const open = useSpring(0, { stiffness: 260, damping: 24 });
  const top = useTransform(open, (k) => peel(k).top);
  const flap = useTransform(open, (k) => peel(k).flap);
  const arrowOpacity = useTransform(open, [0.3, 0.9], [0, 1]);
  const arrowOffset = useTransform(open, [0, 1], [6, 0]);
  const arrowRise = useTransform(arrowOffset, (v) => -v);

  // Hover lifts the corner, pressing pulls it a little further.
  useEffect(() => {
    const target = pressed ? 1.12 : hovered ? 1 : 0;
    if (reduceMotion) open.jump(target);
    else open.set(target);
  }, [hovered, pressed, reduceMotion, open]);

  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-6">
      <button
        type="button"
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onFocus={(e) => setHovered(e.target.matches(":focus-visible"))}
        onBlur={() => setHovered(false)}
        style={{ width: W, height: H }}
        className="relative cursor-pointer overflow-hidden rounded-2xl bg-muted text-left shadow-[0_1px_2px_rgb(0_0_0/0.08),0_8px_20px_-8px_rgb(0_0_0/0.2)] outline-none select-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-4 focus-visible:ring-offset-card"
      >
        {/* What the sticker was covering. */}
        <motion.span
          style={{ opacity: arrowOpacity, x: arrowOffset, y: arrowRise }}
          className="absolute inset-y-0 right-5 grid place-items-center text-foreground"
        >
          <ArrowUpRight className="size-5" strokeWidth={2.25} />
        </motion.span>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          aria-hidden
          className="absolute inset-0 size-full"
        >
          <defs>
            <linearGradient
              id="peel-flap"
              gradientUnits="userSpaceOnUse"
              x1={W * 0.62}
              y1={H * 0.6}
              x2={W * 0.86}
              y2={H * 0.3}
            >
              <stop
                offset="0"
                className="[stop-color:color-mix(in_oklab,var(--color-foreground)_12%,var(--color-background))]"
              />
              <stop
                offset="1"
                className="[stop-color:color-mix(in_oklab,var(--color-foreground)_42%,var(--color-background))]"
              />
            </linearGradient>
            <filter id="peel-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          {/* The lifted corner's shadow on the layer below. */}
          <motion.path
            d={flap}
            transform="translate(5 3)"
            filter="url(#peel-blur)"
            className="fill-black/25"
          />
          <motion.path d={flap} fill="url(#peel-flap)" />
          <motion.path d={top} className="fill-foreground" />
        </svg>

        <span className="pointer-events-none relative pl-5 text-[15px] font-semibold tracking-tight text-background">
          Discover more
        </span>
      </button>

      <p className="text-[11px] font-medium text-muted-foreground">
        Hover to peel, press to pull
      </p>
    </div>
  );
}
