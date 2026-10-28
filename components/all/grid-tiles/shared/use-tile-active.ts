import { useRef, useState } from "react";

import { useInView } from "motion/react";

import { useIsTouch } from "./use-is-touch";

/**
 * Whether an illustrated tile should be showing its "active" state: hovered
 * on a pointer device, or fully on screen on touch, which has no hover.
 * Spread `hoverProps` onto the tile's root motion element.
 */
export const useTileActive = <T extends Element>() => {
  const ref = useRef<T>(null);
  const [hovered, setHovered] = useState(false);

  const isInView = useInView(ref, { amount: "all" });
  const isTouch = useIsTouch();

  return {
    ref,
    active: isTouch ? isInView : hovered,
    hoverProps: {
      onHoverStart: () => setHovered(true),
      onHoverEnd: () => setHovered(false),
    },
  };
};
