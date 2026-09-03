"use client";

import { useTheme } from "next-themes";

import { Moon, Sun } from "lucide-react";

import { toggleThemeWithTransition } from "@/lib/utils";

/**
 * Which icon shows is decided by CSS off the `.dark` class rather than by
 * React state. next-themes only learns the stored theme in an effect, so a
 * state-driven icon renders the wrong one for a frame on every load; the
 * class is already on <html> before first paint.
 */
const ThemeSwitch = (): React.JSX.Element => {
  const { setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleThemeWithTransition(() =>
        /* Read the live class for the same reason — `theme` is still
           undefined if this is clicked before that effect has run. */
        setTheme(
          document.documentElement.classList.contains("dark")
            ? "light"
            : "dark",
        ),
      )}
      className="flex items-center text-foreground/60 transition-colors hover:text-foreground"
    >
      <Sun aria-hidden className="size-4.5 stroke-2 dark:hidden" />
      <Moon aria-hidden className="hidden size-4.5 stroke-2 dark:block" />
    </button>
  );
};

export default ThemeSwitch;
