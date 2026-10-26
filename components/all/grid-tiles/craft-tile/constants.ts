/* At rest the cards sit as a tight, faded deck; active, they spring out into
   a fan. Loose enough to overshoot a little, so it reads as a burst. */
export const spring = { type: "spring", stiffness: 260, damping: 18 } as const;

export const FAN = [
  {
    rest: { x: "-12%", y: 12, rotate: -5, scale: 0.86 },
    active: { x: "-90%", y: 10, rotate: -9, scale: 1 },
  },
  {
    rest: { x: "0%", y: 4, rotate: 0, scale: 0.9 },
    active: { x: "0%", y: -6, rotate: 0, scale: 1.06 },
  },
  {
    rest: { x: "12%", y: 12, rotate: 5, scale: 0.86 },
    active: { x: "90%", y: 10, rotate: 9, scale: 1 },
  },
];

/* Scattered marks that keep the tile alive while the deck is closed. */
export const SPARKS = [
  "top-4 left-6",
  "top-7 right-10",
  "top-1/2 left-[12%]",
  "bottom-12 right-[14%]",
  "top-[22%] right-[30%]",
];

/* Shooting stars, all travelling the same way: in from the top right, out
   towards the bottom left. Long, uneven gaps keep them occasional. */
export const SHOOTING_STARS = [
  { position: "-top-2 right-[12%]", duration: 2.6, delay: 1.2, gap: 7 },
  { position: "top-[18%] -right-4", duration: 3, delay: 5.5, gap: 10 },
  { position: "-top-3 right-[42%]", duration: 2.4, delay: 9, gap: 12 },
];
