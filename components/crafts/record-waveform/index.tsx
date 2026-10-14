"use client";

import { useEffect, useState } from "react";

import { Mic, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "motion/react";

const BARS = 8;
const SIZE = 104;
const RADIUS = 42;

// A bar's level is the share of the ring it covers. Each one owns an eighth,
// so anything under 0.1 leaves a gap on both sides.
const REST = 0.05;
const rest = () => Array<number>(BARS).fill(REST);
// One loudness per tick shared by every bar, so the ring swells and drops
// together like a syllable instead of flickering bar by bar.
const listen = () => {
  const loudness = 0.35 + Math.random() * 0.65;
  return rest().map(() => 0.02 + loudness * Math.random() * 0.075);
};

const SPRING = { type: "spring", stiffness: 320, damping: 22 } as const;
const SWAP = { duration: 0.2 } as const;

export default function RecordWaveform() {
  const [recording, setRecording] = useState(false);
  const [levels, setLevels] = useState(rest);
  const [seconds, setSeconds] = useState(0);
  const reduceMotion = useReducedMotion();
  const voice = levels.reduce((sum, level) => sum + level, 0) / BARS;

  useEffect(() => {
    if (!recording) return;
    const start = Date.now();
    const interval = window.setInterval(() => {
      setSeconds(Math.floor((Date.now() - start) / 1000));
      if (!reduceMotion) setLevels(listen());
    }, 140);
    return () => window.clearInterval(interval);
  }, [recording, reduceMotion]);

  const toggle = () => {
    setRecording(!recording);
    setLevels(rest());
    setSeconds(0);
  };

  return (
    <MotionConfig reducedMotion="user" transition={SPRING}>
      <div className="flex w-full grow flex-col items-center justify-center gap-6">
        <div
          style={{ width: SIZE, height: SIZE }}
          className="relative grid place-items-center"
        >
          <AnimatePresence>
            {recording && (
              <motion.svg
                aria-hidden
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                initial={{ opacity: 0, scale: 0.7, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.7, filter: "blur(6px)" }}
                className="pointer-events-none absolute inset-0 size-full text-foreground"
              >
                {levels.map((level, i) => (
                  // One full circle per bar, turned to its slot. Only a short
                  // dash of it is drawn, kept centred as it grows and shrinks.
                  <g
                    key={i}
                    transform={`rotate(${(i + 0.5) * (360 / BARS) - 180} ${SIZE / 2} ${SIZE / 2})`}
                  >
                    <motion.circle
                      cx={SIZE / 2}
                      cy={SIZE / 2}
                      r={RADIUS}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={4}
                      strokeLinecap="round"
                      initial={false}
                      animate={{
                        pathLength: level,
                        pathOffset: 0.5 - level / 2,
                      }}
                    />
                  </g>
                ))}
              </motion.svg>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={toggle}
            aria-pressed={recording}
            aria-label={recording ? "Stop recording" : "Start recording"}
            // The button breathes with the voice: louder pushes it out,
            // quieter lets it sink, so the ring and the button move as one.
            animate={{ scale: recording ? 1 + (voice - REST) * 2 : 1 }}
            whileTap={{ scale: 0.92 }}
            className="relative grid size-14 cursor-pointer place-items-center rounded-full border border-border bg-background shadow-[0_1px_2px_rgb(0_0_0/0.06),0_6px_16px_-6px_rgb(0_0_0/0.18)] outline-none select-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <AnimatePresence initial={false}>
              <motion.span
                key={recording ? "stop" : "mic"}
                initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                transition={SWAP}
                className="col-start-1 row-start-1"
              >
                {recording ? (
                  <X className="size-5 text-foreground" strokeWidth={2.75} />
                ) : (
                  <Mic className="size-5 text-red-500" strokeWidth={2.25} />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        <p
          role="timer"
          className="text-[11px] font-medium text-muted-foreground tabular-nums"
        >
          {recording
            ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
            : "Tap to record"}
        </p>
      </div>
    </MotionConfig>
  );
}
