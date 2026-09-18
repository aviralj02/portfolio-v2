"use client";

import {
  type ChangeEvent,
  type ClipboardEvent,
  Fragment,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

const LENGTH = 6;

export default function OtpInput() {
  const [otp, setOtp] = useState<string[]>(Array(LENGTH).fill(""));
  const [focused, setFocused] = useState(-1);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const complete = otp.every(Boolean);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, "").slice(-1);
    if (e.target.value && !value) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      e.preventDefault();
      const next = [...otp];
      next[index - 1] = "";
      setOtp(next);
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, LENGTH)
      .split("");
    if (!digits.length) return;
    setOtp([...digits, ...Array(LENGTH - digits.length).fill("")]);
    inputRefs.current[Math.min(digits.length, LENGTH - 1)]?.focus();
  };

  useEffect(() => {
    inputRefs.current[0]?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-sm font-medium text-primary">Verify it&apos;s you</p>
        <p className="text-xs text-muted-foreground">
          Enter the 6-digit code we sent you
        </p>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {otp.map((digit, index) => (
          <Fragment key={index}>
            {index === LENGTH / 2 && (
              <span className="mx-0.5 h-px w-3 rounded-full bg-border sm:mx-1" />
            )}
            <motion.div
              animate={
                complete ? { y: [0, -6, 0] } : { y: focused === index ? -2 : 0 }
              }
              transition={{
                duration: 0.4,
                delay: complete ? index * 0.05 : 0,
                ease: "easeOut",
              }}
              className={cn(
                "relative flex h-13 w-9.5 items-center justify-center rounded-xl border bg-background transition-[border-color,box-shadow,background-color] duration-200 sm:h-14 sm:w-11",
                "shadow-(--key-well-shadow)",
                focused === index
                  ? "border-primary/45 shadow-[var(--key-well-shadow),0_0_0_1px_hsl(var(--ring)/0.35),0_8px_20px_-10px_hsl(var(--ring)/0.55)]"
                  : "border-border/80 hover:border-border",
                complete &&
                  "border-emerald-600/35 bg-emerald-500/5 shadow-[var(--key-well-shadow),0_0_0_1px_rgb(16_185_129/0.3)] dark:border-emerald-400/30",
              )}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {digit && (
                  <motion.span
                    key={digit}
                    initial={{
                      y: 10,
                      opacity: 0,
                      scale: 0.6,
                      filter: "blur(4px)",
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      scale: 1,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      y: -10,
                      opacity: 0,
                      scale: 0.6,
                      filter: "blur(4px)",
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 26 }}
                    className={cn(
                      "text-[22px] font-semibold tracking-tight tabular-nums",
                      complete
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-primary",
                    )}
                  >
                    {digit}
                  </motion.span>
                )}
              </AnimatePresence>

              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                inputMode="numeric"
                autoComplete="off"
                aria-label={`Digit ${index + 1}`}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                onFocus={(e) => {
                  setFocused(index);
                  e.target.select();
                }}
                onBlur={() => setFocused(-1)}
                className="absolute inset-0 size-full cursor-text rounded-xl bg-transparent text-center text-transparent caret-transparent outline-none selection:bg-transparent"
              />
            </motion.div>
          </Fragment>
        ))}
      </div>

      <p aria-live="polite" className="text-[11px] font-medium">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={complete ? "done" : "idle"}
            initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
            transition={{ duration: 0.2 }}
            className={cn(
              "inline-block",
              complete
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-muted-foreground",
            )}
          >
            {complete ? "Code verified" : "Paste works too"}
          </motion.span>
        </AnimatePresence>
      </p>
    </div>
  );
}
