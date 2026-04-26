"use client";

import { useEffect, useState } from "react";

/** Aligns with Tailwind’s default `md` breakpoint (768px). */
const DEFAULT_MAX_WIDTH_PX = 767;

function getQuery(maxWidthPx: number) {
  return `(max-width: ${maxWidthPx}px)`;
}

type UseIsMobileOptions = {
  /** Viewport width at or below this value counts as mobile. Default 767 (below `md`). */
  maxWidthPx?: number;
};

/**
 * Returns whether the viewport matches a mobile-width media query.
 * Before hydration, returns `false` to match server output; updates on mount and on resize.
 */
export function useIsMobile(options?: UseIsMobileOptions): boolean {
  const maxWidthPx = options?.maxWidthPx ?? DEFAULT_MAX_WIDTH_PX;
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = getQuery(maxWidthPx);
    const mq = window.matchMedia(query);

    const sync = () => setMatches(mq.matches);
    sync();

    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [maxWidthPx]);

  return matches;
}
