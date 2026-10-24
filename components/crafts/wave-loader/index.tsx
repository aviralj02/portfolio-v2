"use client";

import { useEffect, useRef, useState } from "react";

import { Check } from "lucide-react";
import { motion, MotionConfig } from "motion/react";

type Phase = "idle" | "loading" | "done";

const LABEL = "Save changes";

const SPRING = { type: "spring", bounce: 0.2, duration: 0.6 } as const;
const WIDTH = { idle: 128, loading: 128, done: 96 };

// How far apart the bars sit while they wait, and how tall they stand.
const PITCH = 7.5;
const BAR = 12;
// Resting bars are dimmed so the one being read stands out.
const DIM = 0.35;
// One bar per letter of the label.
const BARS = [...LABEL].filter((letter) => letter.trim()).length;

const SHOWN = { opacity: 1, filter: "blur(0px)" };
const HIDDEN = { opacity: 0, filter: "blur(4px)" };

export default function WaveLoader() {
  const [phase, setPhase] = useState<Phase>("idle");
  // Where each letter sits, measured from the button's center.
  const [homes, setHomes] = useState<number[]>(() => Array(BARS).fill(0));
  const buttonRef = useRef<HTMLButtonElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Measure once the font is in, so each bar is born under its letter.
  useEffect(() => {
    let live = true;
    void document.fonts.ready.then(() => {
      if (!live || !buttonRef.current) return;
      const box = buttonRef.current.getBoundingClientRect();
      const center = box.left + box.width / 2;
      setHomes(
        letterRefs.current
          .filter((el) => el?.textContent?.trim())
          .map((el) => {
            const r = el!.getBoundingClientRect();
            return r.left + r.width / 2 - center;
          }),
      );
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (phase === "idle") return;
    const timeout = window.setTimeout(
      () => setPhase(phase === "loading" ? "done" : "idle"),
      phase === "loading" ? 3200 : 2200,
    );
    return () => window.clearTimeout(timeout);
  }, [phase]);

  const idle = phase === "idle";
  const loading = phase === "loading";
  const done = phase === "done";
  const mid = (BARS - 1) / 2;

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex w-full grow items-center justify-center">
        <motion.button
          ref={buttonRef}
          type="button"
          onClick={() => idle && setPhase("loading")}
          aria-busy={loading}
          aria-label={done ? "Saved" : LABEL}
          initial={false}
          animate={{ width: WIDTH[phase] }}
          transition={SPRING}
          className="relative h-10 cursor-pointer overflow-hidden rounded-full bg-foreground text-sm font-medium text-background outline-none select-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          {/* On click each letter thins out where it stands, leaving a bar
              behind. Coming back, the label just blurs in whole. */}
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center whitespace-pre"
          >
            {[...LABEL].map((letter, i) => (
              <motion.span
                key={i}
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                initial={false}
                animate={
                  idle
                    ? { ...SHOWN, scaleX: 1 }
                    : { ...HIDDEN, filter: "blur(2px)", scaleX: 0.2 }
                }
                transition={
                  idle
                    ? { duration: 0.25, delay: 0.1, scaleX: { duration: 0 } }
                    : { duration: 0.2, delay: i * 0.02 }
                }
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </span>

          {/* The bars line up and get read one by one, each tipping on its
              base like a domino. */}
          {homes.map((home, k) => (
            <motion.span
              key={k}
              aria-hidden
              initial={false}
              animate={
                loading
                  ? { ...SHOWN, x: (k - mid) * PITCH }
                  : { ...HIDDEN, x: done ? (k - mid) * PITCH : home }
              }
              transition={
                loading
                  ? {
                      opacity: { delay: k * 0.02 + 0.08, duration: 0.1 },
                      filter: { duration: 0 },
                      x: { ...SPRING, delay: k * 0.02 + 0.25 },
                    }
                  : { duration: 0.2 }
              }
              className="absolute top-1/2 left-1/2"
            >
              <motion.span
                initial={false}
                animate={
                  loading
                    ? { rotate: [0, 32, 0, 0], opacity: [DIM, 1, DIM, DIM] }
                    : { rotate: 0, opacity: DIM }
                }
                transition={
                  loading
                    ? {
                        duration: 1.3,
                        times: [0, 0.25, 0.6, 1],
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: 0.6 + k * 0.08,
                      }
                    : { duration: 0.2 }
                }
                style={{ height: BAR }}
                className="absolute w-0.5 origin-bottom -translate-1/2 rounded-full bg-current"
              />
            </motion.span>
          ))}

          <motion.span
            aria-hidden
            initial={false}
            animate={done ? SHOWN : HIDDEN}
            transition={{ duration: 0.25, delay: done ? 0.1 : 0 }}
            className="absolute inset-0 flex items-center justify-center gap-1.5"
          >
            <Check className="size-4" strokeWidth={2.5} />
            Saved
          </motion.span>
        </motion.button>
      </div>
    </MotionConfig>
  );
}
