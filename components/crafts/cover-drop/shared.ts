import type { MotionStyle } from "motion/react";

export type Photo = { id: string; alt: string };

export const PHOTOS: Array<Photo> = [
  { id: "1493246507139-91e8fad9978e", alt: "A still lake at sunset" },
  { id: "1501785888041-af3ef285b470", alt: "A boat on a mountain lake" },
  { id: "1506905925346-21bda4d32df4", alt: "Peaks above the clouds" },
  { id: "1519681393784-d120267933ba", alt: "The Milky Way over mountains" },
];

export const src = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&q=80&auto=format&fit=crop`;

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const DRAIN = { duration: 0.3, ease: EASE_OUT };
export const HOME = { type: "spring" as const, duration: 0.4, bounce: 0.2 };

// A soft-edged circle whose radius is animated through --r.
const LIQUID =
  "radial-gradient(circle at 50% 50%, #000 calc(var(--r) - 14%), transparent var(--r))";

export const liquidMask = (radius: string) =>
  ({
    "--r": radius,
    maskImage: LIQUID,
    WebkitMaskImage: LIQUID,
  }) as MotionStyle;
