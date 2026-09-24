"use client";

import { type FormEvent, useRef, useState } from "react";

import {
  ArrowRight,
  ChevronsUpDown,
  Globe,
  Images,
  Sparkle,
} from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";

import { cn } from "@/lib/utils";

import MorphText from "./morph-text";

const RAISED =
  "shadow-[0_1px_2px_rgb(0_0_0/0.06),0_4px_12px_-4px_rgb(0_0_0/0.12)] outline-none focus-visible:ring-2 focus-visible:ring-foreground/20";

const MODES = [
  { icon: Sparkle, placeholder: "Ask Anything" },
  { icon: Images, placeholder: "Generate Image" },
  { icon: Globe, placeholder: "Search the Web" },
];

export default function QuickSwitch() {
  // Only ever counts up, so every switch gets a fresh key, even when fast
  // taps land back on a mode whose old word is still animating out.
  const [switches, setSwitches] = useState(0);
  const [sends, setSends] = useState(0);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { icon: Icon, placeholder } = MODES[switches % MODES.length];
  const hasText = Boolean(value.trim());

  const handleSwitch = () => {
    setSwitches((n) => n + 1);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setSends((n) => n + 1);
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex w-full grow flex-col items-center justify-center gap-6">
        <form
          onSubmit={handleSubmit}
          className="flex h-12 w-full max-w-80 items-center gap-1 rounded-full bg-muted p-1 ring-1 ring-transparent transition-shadow duration-200 focus-within:ring-foreground/10"
        >
          <motion.button
            type="button"
            onClick={handleSwitch}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            aria-label={`Switch mode, current: ${placeholder}`}
            className={cn(
              "group flex h-full shrink-0 cursor-pointer items-center gap-1 rounded-full bg-background pr-2.5 pl-3 text-foreground",
              RAISED,
            )}
          >
            <span className="grid size-4 place-items-center">
              <AnimatePresence initial={false}>
                <motion.span
                  key={switches}
                  initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="col-start-1 row-start-1"
                >
                  <Icon
                    className="size-4"
                    strokeWidth={2.25}
                    fill={Icon === Sparkle ? "currentColor" : "none"}
                  />
                </motion.span>
              </AnimatePresence>
            </span>
            {/* Remounts on every switch, so the chevrons tick down once per tap. */}
            <motion.span
              key={switches}
              initial={{ y: switches ? -3 : 0 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 15 }}
              className="text-muted-foreground transition-colors group-hover:text-foreground"
            >
              <ChevronsUpDown className="size-3" />
            </motion.span>
          </motion.button>

          <div className="relative h-full min-w-0 flex-1">
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label={placeholder}
              autoComplete="off"
              className="size-full bg-transparent px-2 text-sm text-foreground caret-foreground outline-none"
            />
            <AnimatePresence initial={false}>
              {!value && (
                <motion.span
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.2 }}
                  className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-sm text-muted-foreground"
                >
                  <MorphText text={placeholder} id={switches} />
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="submit"
            disabled={!hasText}
            animate={{ scale: hasText ? 1 : 0.92 }}
            whileHover={hasText ? { scale: 1.06 } : undefined}
            whileTap={hasText ? { scale: 0.9 } : undefined}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            aria-label="Send"
            className={cn(
              "grid aspect-square h-full shrink-0 place-items-center overflow-hidden rounded-full transition-colors duration-200",
              RAISED,
              hasText
                ? "cursor-pointer bg-foreground text-background"
                : "cursor-default bg-background text-muted-foreground",
            )}
          >
            {/* Each send swaps the arrow: the old one shoots off to the right
              while a fresh one slides in from the left. */}
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={sends}
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 16, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="col-start-1 row-start-1"
              >
                <ArrowRight className="size-4" strokeWidth={2.25} />
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </form>

        <p className="text-[11px] font-medium text-muted-foreground">
          Tap the pill to switch modes
        </p>
      </div>
    </MotionConfig>
  );
}
