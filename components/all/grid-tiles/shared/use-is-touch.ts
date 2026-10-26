import { useSyncExternalStore } from "react";

const TOUCH_QUERY = "(hover: none)";

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(TOUCH_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(TOUCH_QUERY).matches;

/** Whether the primary input can't hover. `false` on the server. */
export const useIsTouch = () =>
  useSyncExternalStore(subscribe, getSnapshot, () => false);
