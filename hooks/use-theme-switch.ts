"use client";

import { useTheme } from "next-themes";

import { toggleThemeWithTransition } from "@/lib/utils";

export function useThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();

  const mounted = resolvedTheme !== undefined;
  const dark = resolvedTheme === "dark";
  const toggle = toggleThemeWithTransition(() =>
    setTheme(dark ? "light" : "dark"),
  );

  return { dark, mounted, toggle };
}
