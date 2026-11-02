"use client";

import { useState } from "react";

import { Check, Eye, EyeOff } from "lucide-react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  type Variants,
} from "motion/react";
import { z } from "zod";

import { cn } from "@/lib/utils";

const RULES = [
  { id: "length", phrase: "8+ characters" },
  { id: "upper", phrase: "an uppercase letter" },
  { id: "number", phrase: "a number" },
  { id: "symbol", phrase: "a symbol" },
] as const;

// Each check reports the id of the rule it enforces, so the issues zod
// returns are exactly the rules still owed.
const password = z
  .string()
  .min(8, "length")
  .regex(/[A-Z]/, "upper")
  .regex(/\d/, "number")
  .regex(/[^A-Za-z0-9\s]/, "symbol");

const unmet = (value: string) => {
  const result = password.safeParse(value);
  return new Set(
    result.success ? [] : result.error.issues.map((i) => i.message),
  );
};

// Join what's left back into a sentence: "a, b and c."
const joiner = (i: number, n: number) =>
  i < n - 2 ? ", " : i === n - 2 ? " and " : ".";

const SMOOTH = [0.65, 0, 0.35, 1] as const;
const OUT = [0.22, 1, 0.36, 1] as const;
// The strike draws, then holds so it reads, then the phrase leaves.
const STRIKE = 0.2;
const HOLD = 0.35;
const LEAVE = STRIKE + HOLD;

// A phrase moves through three states and its strike and text follow along.
const phrase: Variants = {
  hidden: { width: 0, opacity: 0, filter: "blur(2px)" },
  shown: {
    width: "auto",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: OUT },
  },
  struck: {
    width: 0,
    opacity: 0,
    filter: "blur(2px)",
    transition: { duration: 0.4, ease: SMOOTH, delay: LEAVE },
  },
};
const strike: Variants = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 0 },
  struck: { scaleX: 1, transition: { duration: STRIKE, ease: OUT } },
};
const words: Variants = {
  hidden: { opacity: 1 },
  shown: { opacity: 1 },
  struck: { opacity: 0.4, transition: { duration: STRIKE } },
};

const swap = {
  initial: { opacity: 0, scale: 0.6, filter: "blur(3px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.6, filter: "blur(3px)" },
  transition: { duration: 0.18 },
};

const MAX = 24;

export default function PasswordRules() {
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);

  const missing = unmet(value);
  const pending = RULES.filter((rule) => missing.has(rule.id));
  const strong = pending.length === 0;

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex w-full grow items-center justify-center">
        <div className="flex w-72 max-w-full flex-col gap-3">
          <label className="flex h-12 cursor-text items-center rounded-2xl bg-muted pr-1.5 pl-4 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_6px_16px_-4px_rgb(0_0_0/0.1)] transition-colors focus-within:bg-accent dark:shadow-[0_1px_2px_rgb(0_0_0/0.3),0_6px_16px_-4px_rgb(0_0_0/0.5)]">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={MAX}
              placeholder="Password"
              aria-label="Password"
              aria-describedby="password-rules"
              aria-invalid={value !== "" && !strong}
              autoComplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-bwignore
              data-form-type="other"
              spellCheck={false}
              style={{ transitionDelay: `${strong ? LEAVE : 0}s` }}
              className={cn(
                "h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground caret-foreground outline-none transition-colors duration-300 selection:bg-foreground/15 placeholder:text-muted-foreground/70",
                !visible && "[-webkit-text-security:disc]",
                strong && "text-emerald-500",
              )}
            />

            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              onMouseDown={(e) => e.preventDefault()}
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-xl text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/20"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={visible ? "hide" : "show"} {...swap}>
                  {visible ? (
                    <EyeOff className="size-4" strokeWidth={2.25} />
                  ) : (
                    <Eye className="size-4" strokeWidth={2.25} />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </label>

          {/* The rules read as one sentence. A met phrase is struck through
              in green, dims while the strike holds, then closes up so the
              rest of the sentence slides together. The block keeps its height
              so the field never moves while typing. */}
          <div
            id="password-rules"
            aria-live="polite"
            className="relative h-10 px-1 text-[13px] leading-5 text-muted-foreground"
          >
            <motion.p
              aria-hidden={strong}
              initial={false}
              animate={
                strong
                  ? { opacity: 0, filter: "blur(3px)" }
                  : { opacity: 1, filter: "blur(0px)" }
              }
              transition={{
                duration: 0.3,
                ease: SMOOTH,
                delay: strong ? LEAVE : 0,
              }}
            >
              Use{" "}
              <AnimatePresence initial={false}>
                {pending.map((rule, i) => (
                  <motion.span
                    key={rule.id}
                    layout="position"
                    variants={phrase}
                    initial="hidden"
                    animate="shown"
                    exit="struck"
                    className="inline-block overflow-hidden align-bottom whitespace-pre"
                  >
                    <span className="relative">
                      <motion.span variants={words}>{rule.phrase}</motion.span>
                      <motion.span
                        variants={strike}
                        className="absolute inset-x-0 top-1/2 h-px origin-left bg-emerald-500"
                      />
                    </span>
                    {joiner(i, pending.length)}
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.p>

            <motion.p
              aria-hidden={!strong}
              initial={false}
              animate={
                strong
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 4, filter: "blur(3px)" }
              }
              transition={{
                duration: 0.3,
                ease: OUT,
                delay: strong ? LEAVE + 0.2 : 0,
              }}
              className="absolute inset-x-1 top-0 flex items-center gap-1.5 text-foreground"
            >
              <Check className="size-3.5 text-emerald-500" strokeWidth={2.5} />
              Good to go
            </motion.p>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
