"use client";

import { useState } from "react";
import { useTheme } from "next-themes";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { toggleThemeWithTransition } from "@/lib/utils";

const ThemeToggle = (): React.JSX.Element => {
  const { setTheme, resolvedTheme } = useTheme();
  const prefersReduced = useReducedMotion();

  const [initial] = useState<"light" | "dark">(() =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
  );

  const dark =
    (resolvedTheme === "light" || resolvedTheme === "dark"
      ? resolvedTheme
      : initial) === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      aria-pressed={dark}
      onClick={toggleThemeWithTransition(() =>
        setTheme(dark ? "light" : "dark"),
      )}
      className="key-well group cursor-pointer rounded-full p-2"
    >
      <motion.span
        className="key-face relative flex h-10 w-[124px] items-center justify-center overflow-hidden rounded-full"
        whileTap={prefersReduced ? {} : { scale: 0.920 }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
      >
        <span aria-hidden className="key-gloss absolute inset-0" />

        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={dark ? "moon" : "sun"}
            aria-hidden
            className="key-icon relative flex transition-[color,filter] duration-300"
            initial={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, rotate: -70, scale: 0.6 }
            }
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, rotate: 70, scale: 0.6 }
            }
            transition={
              prefersReduced
                ? { duration: 0.12 }
                : { type: "spring", stiffness: 520, damping: 26 }
            }
          >
            {dark ? (
              <Moon fill="currentColor" strokeWidth={0} className="size-6" />
            ) : (
              <Sun fill="currentColor" strokeWidth={2.25} className="size-6" />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
};

export default ThemeToggle;
