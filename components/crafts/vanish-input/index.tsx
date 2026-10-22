"use client";

import { useEffect, useRef, useState } from "react";

import { ArrowRightToLine, CornerDownLeft, Search } from "lucide-react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useAnimate,
  useReducedMotion,
} from "motion/react";

import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Quiet cafes nearby",
  "Ramen open late",
  "Weekend hikes",
  "Bookshops with a view",
];

type Mode = "send" | "drop";

type Particle = {
  x: number;
  y: number;
  a: number;
  // Where the arc into the lens bends.
  cx: number;
  cy: number;
  // How a dropped particle is thrown.
  vx: number;
  vy: number;
  delay: number;
  life: number;
};

// Room around the bar for particles to fly through.
const M = 72;
const SWEEP = 0.25;
const FLY = 0.45;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export default function VanishInput() {
  const [value, setValue] = useState("");
  const [vanishing, setVanishing] = useState<Mode | null>(null);
  const [hint, setHint] = useState(0);
  // A stand-in caret that rides the dissolving edge back to the start.
  const [caret, setCaret] = useState<{
    key: number;
    from: number;
    to: number;
  }>();
  const reduceMotion = useReducedMotion();

  const [bar, animate] = useAnimate<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>(null);
  const lensRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  const empty = value === "";
  const suggestion = SUGGESTIONS[hint];

  // Cycle the suggestion while there's nothing typed.
  useEffect(() => {
    if (!empty) return;
    const interval = window.setInterval(
      () => setHint((h) => (h + 1) % SUGGESTIONS.length),
      2800,
    );
    return () => window.clearInterval(interval);
  }, [empty]);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const vanish = (mode: Mode) => {
    const input = inputRef.current;
    const lens = lensRef.current;
    const canvas = canvasRef.current;
    if (!input || !lens || !canvas || !bar.current) return;

    if (!value.trim()) {
      animate(bar.current, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.35 });
      return;
    }
    if (reduceMotion) {
      setValue("");
      return;
    }

    // Paint the text exactly where the input shows it, then read it back as
    // pixels. Every filled pixel becomes a particle.
    const dpr = window.devicePixelRatio || 1;
    const box = bar.current.getBoundingClientRect();
    const field = input.getBoundingClientRect();
    const target = lens.getBoundingClientRect();
    const width = box.width + M * 2;
    const height = box.height + M * 2;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const style = getComputedStyle(input);
    const left = M + field.left - box.left;
    const top = M + field.top - box.top;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.save();
    ctx.beginPath();
    ctx.rect(left, top, field.width, field.height);
    ctx.clip();
    ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    ctx.fillStyle = style.color;
    ctx.textBaseline = "middle";
    const textStart = parseFloat(style.paddingLeft);
    const textEnd = Math.min(
      textStart + ctx.measureText(value).width - input.scrollLeft,
      field.width - parseFloat(style.paddingRight),
    );
    ctx.fillText(
      value,
      left + textStart - input.scrollLeft,
      top + field.height / 2,
    );
    ctx.restore();
    ctx.fillStyle = style.color;

    const step = Math.max(1, Math.round(dpr));
    const size = step / dpr;
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const particles: Particle[] = [];
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const alpha = pixels[(y * canvas.width + x) * 4 + 3];
        if (alpha < 64) continue;
        const px = x / dpr;
        const py = y / dpr;
        particles.push({
          x: px,
          y: py,
          a: alpha / 255,
          cx: px + rand(0, 24),
          cy: py + rand(-16, 16),
          vx: rand(-30, 30),
          vy: rand(-60, -15),
          delay: 0,
          life: FLY * rand(0.8, 1.2),
        });
      }
    }

    // Release from the right end first, sweeping back towards the lens.
    const xs = particles.map((p) => p.x);
    const min = Math.min(...xs);
    const span = Math.max(...xs) - min || 1;
    particles.forEach((p) => (p.delay = (1 - (p.x - min) / span) * SWEEP));

    const tx = M + target.left - box.left + target.width / 2;
    const ty = M + target.top - box.top + target.height / 2;
    const start = performance.now();

    const frame = (now: number) => {
      const t = (now - start) / 1000;
      let alive = 0;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        const u = Math.min(Math.max((t - p.delay) / p.life, 0), 1);
        if (u >= 1) continue;
        alive++;

        let x: number;
        let y: number;
        let alpha = p.a;
        if (mode === "send") {
          // Pulled in faster the closer it gets, along a curve.
          const e = u * u;
          x = (1 - e) ** 2 * p.x + 2 * (1 - e) * e * p.cx + e * e * tx;
          y = (1 - e) ** 2 * p.y + 2 * (1 - e) * e * p.cy + e * e * ty;
          alpha *= 1 - u ** 4;
        } else {
          const s = u * p.life;
          x = p.x + p.vx * s;
          y = p.y + p.vy * s + 520 * s * s;
          alpha *= 1 - u;
        }
        ctx.globalAlpha = alpha;
        ctx.fillRect(x, y, size, size);
      }

      if (alive) {
        frameRef.current = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, width, height);
        setVanishing(null);
      }
    };

    cancelAnimationFrame(frameRef.current);
    setValue("");
    setVanishing(mode);
    setCaret((c) => ({ key: (c?.key ?? 0) + 1, from: textEnd, to: textStart }));
    frameRef.current = requestAnimationFrame(frame);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      vanish("send");
    } else if (e.key === "Escape") {
      if (empty) inputRef.current?.blur();
      else vanish("drop");
    } else if (e.key === "Tab" && empty && !e.shiftKey) {
      e.preventDefault();
      setValue(suggestion);
    }
  };

  const swallowing = vanishing === "send";

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex w-full grow items-center justify-center">
        <div
          ref={bar}
          className="relative flex h-11 w-80 max-w-full items-center rounded-xl border border-border bg-background pr-1.5 pl-3.5 shadow-[0_1px_2px_rgb(0_0_0/0.05)] transition-shadow focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-foreground)_8%,transparent)]"
        >
          <motion.span
            ref={lensRef}
            animate={{
              scale: swallowing ? 1.2 : 1,
              rotate: swallowing ? -14 : 0,
            }}
            transition={{ type: "spring", stiffness: 420, damping: 14 }}
            className="grid shrink-0 place-items-center text-muted-foreground"
          >
            <Search className="size-4" strokeWidth={2.25} />
          </motion.span>

          <div className="relative h-full min-w-0 flex-1">
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setCaret(undefined);
              }}
              onKeyDown={onKeyDown}
              maxLength={40}
              spellCheck={false}
              autoComplete="off"
              aria-label="Search"
              className={cn(
                "size-full bg-transparent pr-2 pl-2.5 text-sm font-medium text-foreground outline-none selection:bg-foreground/15",
                caret ? "caret-transparent" : "caret-foreground",
              )}
            />

            {/* The real caret jumps home the moment the value clears, so a
                stand-in glides back with the dissolving edge instead. */}
            <AnimatePresence>
              {caret && (
                <motion.span
                  key={caret.key}
                  aria-hidden
                  initial={{ x: caret.from }}
                  animate={{ x: caret.to }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: SWEEP + 0.12, ease: [0.4, 0, 0.6, 1] }}
                  onAnimationComplete={() => setCaret(undefined)}
                  className="pointer-events-none absolute inset-y-0 left-0 my-auto h-4 w-px bg-foreground"
                />
              )}
            </AnimatePresence>

            {/* The placeholder lives outside the input so it can animate. */}
            <AnimatePresence mode="popLayout" initial={false}>
              {empty && !vanishing && (
                <motion.span
                  key={suggestion}
                  aria-hidden
                  initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center truncate text-sm font-medium text-muted-foreground/70"
                >
                  {suggestion}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Tab takes the suggestion while it's empty, then the same spot
              becomes the submit key. */}
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => (empty ? setValue(suggestion) : vanish("send"))}
            aria-label={empty ? "Use suggestion" : "Search"}
            className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-md border border-border bg-muted/60 text-muted-foreground transition-colors hover:text-foreground"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={empty ? "tab" : "enter"}
                initial={{ opacity: 0, scale: 0.6, filter: "blur(3px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.6, filter: "blur(3px)" }}
                transition={{ duration: 0.18 }}
              >
                {empty ? (
                  <ArrowRightToLine className="size-3.5" strokeWidth={2.25} />
                ) : (
                  <CornerDownLeft className="size-3.5" strokeWidth={2.25} />
                )}
              </motion.span>
            </AnimatePresence>
          </button>

          <canvas
            ref={canvasRef}
            aria-hidden
            style={{ left: -M, top: -M }}
            className="pointer-events-none absolute"
          />
        </div>
      </div>
    </MotionConfig>
  );
}
