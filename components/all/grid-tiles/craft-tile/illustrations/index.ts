import Dial from "./dial";
import QuickSwitch from "./quick-switch";
import WaveLoader from "./wave-loader";

export type { IllustrationProps } from "./types";

/* Crafts cut down to the one gesture that defines each, in deck order: the
   middle one sits on top. */
export const ILLUSTRATIONS = [WaveLoader, QuickSwitch, Dial];
