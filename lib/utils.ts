import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { MonthFormat } from "@/types/enums";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateToMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);
}

export function formatDate(date: Date, monthFormat: MonthFormat): string {
  return date.toLocaleDateString("en-US", {
    month: monthFormat,
    day: "numeric",
    year: "numeric",
  });
}

export const toggleThemeWithTransition = (callback: () => void) => () => {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!document.startViewTransition || reduced) {
    callback();
    return;
  }

  const root = document.documentElement;
  root.classList.add("theme-transition");

  const transition = document.startViewTransition(() => {
    callback();
  });

  transition.finished.finally(() => {
    root.classList.remove("theme-transition");
  });
};
