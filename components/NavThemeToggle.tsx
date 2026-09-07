"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useThemeSwitch } from "@/hooks";

const NavThemeToggle = (): React.JSX.Element => {
  const { dark, mounted, toggle } = useThemeSwitch();
  const prefersReduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      onClick={toggle}
      whileHover={prefersReduced ? {} : { scale: 1.06 }}
      whileTap={prefersReduced ? {} : { scale: 0.9 }}
      transition={{ type: "spring", stiffness: 600, damping: 28 }}
      className="nav-glass-ring pointer-events-auto ml-2.5 hidden cursor-pointer rounded-full p-0.5 sm:block"
    >
      <span className="nav-glass-body flex size-8.5 items-center justify-center rounded-full p-px text-primary/70 transition-colors duration-200 hover:text-primary">
        {mounted && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={dark ? "moon" : "sun"}
              aria-hidden
              className="flex"
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
                <Moon fill="currentColor" strokeWidth={0} className="size-4" />
              ) : (
                <Sun fill="currentColor" strokeWidth={2.25} className="size-4" />
              )}
            </motion.span>
          </AnimatePresence>
        )}
      </span>
    </motion.button>
  );
};

export default NavThemeToggle;
