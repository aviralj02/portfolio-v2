"use client";

import { useEffect, useState } from "react";

import {
  Play,
  RectangleHorizontal,
  RectangleVertical,
  Square,
} from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";

const PHOTOS = [
  {
    id: "1493246507139-91e8fad9978e",
    alt: "A still lake reflecting mountains at sunset",
  },
  {
    id: "1500530855697-b586d89ba3ee",
    alt: "A road running between red canyon walls",
  },
  {
    id: "1501785888041-af3ef285b470",
    alt: "A small boat on a turquoise mountain lake",
  },
  {
    id: "1506905925346-21bda4d32df4",
    alt: "Snowy peaks rising above a sea of clouds",
  },
  {
    id: "1519681393784-d120267933ba",
    alt: "The Milky Way over snowy mountains",
  },
  { id: "1441974231531-c6227db76b6e", alt: "A path through a tall forest" },
];

const src = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop`;

const ASPECTS = [
  { label: "Landscape", icon: RectangleHorizontal, width: 312, height: 208 },
  { label: "Square", icon: Square, width: 256, height: 256 },
  { label: "Portrait", icon: RectangleVertical, width: 224, height: 280 },
];

type Rect = { x: number; y: number; w: number; h: number };
type Line = { x: number; y: number; length: number; vertical: boolean };

// Everything is in fractions of the frame, so the same layout fits any aspect.
const CUTS = [1 / 3, 1 / 2, 2 / 3];

const layout = () => {
  const tiles: Rect[] = [];
  const lines: Line[] = [];

  // Keep cutting a rectangle in two until it's deep enough or gets lucky.
  const split = (r: Rect, depth: number) => {
    if (depth >= 4 || (depth >= 2 && Math.random() < 0.3)) {
      tiles.push(r);
      return;
    }
    const at = CUTS[Math.floor(Math.random() * CUTS.length)];
    if (r.w >= r.h) {
      const w = r.w * at;
      lines.push({ x: r.x + w, y: r.y, length: r.h, vertical: true });
      split({ ...r, w }, depth + 1);
      split({ ...r, x: r.x + w, w: r.w - w }, depth + 1);
    } else {
      const h = r.h * at;
      lines.push({ x: r.x, y: r.y + h, length: r.w, vertical: false });
      split({ ...r, h }, depth + 1);
      split({ ...r, y: r.y + h, h: r.h - h }, depth + 1);
    }
  };
  split({ x: 0, y: 0, w: 1, h: 1 }, 0);

  // Tiles fill in outwards from one random point, like it's growing.
  const sx = Math.random();
  const sy = Math.random();
  const far = (r: Rect) => Math.hypot(r.x + r.w / 2 - sx, r.y + r.h / 2 - sy);
  tiles.sort((a, b) => far(a) - far(b));

  return { tiles, lines };
};

const LINE_STEP = 0.05;
const LINE_DRAW = 0.4;
const TILE_STEP = 0.08;
const RESOLVE = 0.9;

const pct = (n: number) => `${n * 100}%`;

export default function GenerativeGrid() {
  const [aspect, setAspect] = useState(0);
  const [run, setRun] = useState(() => ({ key: 0, photo: 0, ...layout() }));
  const [generating, setGenerating] = useState(true);

  const linesEnd = run.lines.length * LINE_STEP + LINE_DRAW;
  const filled = linesEnd + run.tiles.length * TILE_STEP + 0.3;
  const photo = PHOTOS[run.photo];
  const frame = ASPECTS[aspect];
  const AspectIcon = frame.icon;

  useEffect(() => {
    PHOTOS.forEach((p) => (new Image().src = src(p.id)));
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setGenerating(false),
      (filled + RESOLVE) * 1000,
    );
    return () => window.clearTimeout(timeout);
  }, [run.key, filled]);

  const generate = () => {
    if (generating) return;
    setGenerating(true);
    setRun((r) => ({
      key: r.key + 1,
      photo: (r.photo + 1) % PHOTOS.length,
      ...layout(),
    }));
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex w-full grow flex-col items-center justify-center gap-5">
        <div className="flex items-center rounded-full border border-border bg-background p-1 text-xs font-medium shadow-[0_1px_2px_rgb(0_0_0/0.05)]">
          <motion.button
            type="button"
            onClick={generate}
            // aria-disabled rather than disabled, so keyboard focus stays put
            // while a run plays out.
            aria-disabled={generating}
            aria-label="Generate"
            whileTap={generating ? undefined : { scale: 0.9 }}
            className="grid size-7 cursor-pointer place-items-center rounded-full text-foreground transition-[color,background-color] outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground/20 aria-disabled:cursor-default aria-disabled:text-muted-foreground aria-disabled:hover:bg-transparent"
          >
            <Play className="size-3.5" strokeWidth={2.25} />
          </motion.button>
          <span className="mx-1 h-4 w-px bg-border" />
          <motion.button
            type="button"
            onClick={() => setAspect((a) => (a + 1) % ASPECTS.length)}
            aria-label={`Aspect ratio: ${frame.label}`}
            whileTap={{ scale: 0.95 }}
            className="flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-full px-2.5 text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            <AspectIcon className="size-3.5" strokeWidth={2} />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={frame.label}
                initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                {frame.label}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        <motion.div
          initial={false}
          animate={{ width: frame.width, height: frame.height }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          className="relative max-w-full overflow-hidden rounded-xl border border-border bg-muted/40"
        >
          {/* Its own presence, so every run animates in from scratch and the
              last photo fades off as the next grid starts drawing. */}
          <AnimatePresence>
            <motion.div
              key={run.key}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="absolute inset-0"
            >
              {/* Pieces of the photo, still blurry, landing one by one. */}
              {run.tiles.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: linesEnd + i * TILE_STEP,
                    duration: 0.4,
                  }}
                  style={{
                    left: pct(t.x),
                    top: pct(t.y),
                    width: pct(t.w),
                    height: pct(t.h),
                  }}
                  className="absolute overflow-hidden"
                >
                  <img
                    src={src(photo.id)}
                    alt=""
                    draggable={false}
                    style={{
                      left: pct(-t.x / t.w),
                      top: pct(-t.y / t.h),
                      width: pct(1 / t.w),
                      height: pct(1 / t.h),
                    }}
                    className="absolute max-w-none object-cover blur-lg"
                  />
                </motion.div>
              ))}

              {/* The cuts, drawn in the order they were made. */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: filled, duration: 0.4 }}
                className="absolute inset-0"
              >
                {run.lines.map((l, i) => (
                  <motion.span
                    key={i}
                    initial={l.vertical ? { scaleY: 0 } : { scaleX: 0 }}
                    animate={l.vertical ? { scaleY: 1 } : { scaleX: 1 }}
                    transition={{
                      delay: i * LINE_STEP,
                      duration: LINE_DRAW,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={
                      l.vertical
                        ? {
                            left: pct(l.x),
                            top: pct(l.y),
                            height: pct(l.length),
                          }
                        : {
                            left: pct(l.x),
                            top: pct(l.y),
                            width: pct(l.length),
                          }
                    }
                    className={
                      l.vertical
                        ? "absolute w-0 origin-top border-l border-dashed border-foreground/25"
                        : "absolute h-0 origin-left border-t border-dashed border-foreground/25"
                    }
                  />
                ))}
              </motion.div>

              {/* Then the whole photo comes into focus over the top. */}
              <motion.img
                src={src(photo.id)}
                alt={photo.alt}
                draggable={false}
                initial={{ opacity: 0, filter: "blur(16px)", scale: 1.04 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                transition={{
                  delay: filled,
                  duration: RESOLVE,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 size-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {generating && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="absolute right-2 bottom-2 rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur-sm"
              >
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  Generating
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
