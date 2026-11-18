"use client";

import { useState } from "react";

import { AnimatePresence, motion, type PanInfo } from "motion/react";

import { cn } from "@/lib/utils";

import { DRAIN, HOME, liquidMask, type Photo, src } from "./shared";

type Props = {
  photo: Photo;
  hidden: boolean;
  returnFrom: { x: number; y: number } | null;
  onReturned: () => void;
  onPick: () => void;
  onDrag: (info: PanInfo) => void;
  onDrop: (info: PanInfo) => void;
};

export function Thumbnail({
  photo,
  hidden,
  returnFrom,
  onReturned,
  onPick,
  onDrag,
  onDrop,
}: Props) {
  const [dragging, setDragging] = useState(false);

  return (
    <>
      {/* A faint imprint of the photo stays behind whenever it leaves. */}
      <img
        src={src(photo.id)}
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0 size-full rounded-xl object-cover opacity-15 blur-[1px] grayscale"
      />

      <AnimatePresence initial={false}>
        {!hidden && (
          <motion.button
            key="photo"
            type="button"
            aria-label={`Use ${photo.alt} as cover`}
            onClick={onPick}
            drag
            dragSnapToOrigin
            dragElastic={1}
            dragTransition={{ bounceStiffness: 500, bounceDamping: 30 }}
            onDragStart={() => setDragging(true)}
            onDrag={(_, info) => onDrag(info)}
            onDragEnd={(_, info) => {
              setDragging(false);
              onDrop(info);
            }}
            // Coming back, it leaves the cover as a droplet and spreads into place.
            initial={
              returnFrom ? { ...returnFrom, scale: 0.5, "--r": "45%" } : false
            }
            animate={
              returnFrom ? { x: 0, y: 0, scale: 1, "--r": "140%" } : undefined
            }
            transition={{ ...HOME, "--r": { ...DRAIN, delay: 0.12 } }}
            onAnimationComplete={() => {
              if (returnFrom) onReturned();
            }}
            style={liquidMask("140%")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            whileDrag={{ scale: 1.08, rotate: -4 }}
            className={cn(
              "absolute inset-0 cursor-grab overflow-hidden rounded-xl shadow-[0_1px_2px_rgb(0_0_0/0.12)] outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 active:cursor-grabbing",
              (dragging || returnFrom) && "z-10",
              dragging && "shadow-[0_16px_32px_-8px_rgb(0_0_0/0.35)]",
            )}
          >
            <img
              src={src(photo.id)}
              alt=""
              draggable={false}
              className="pointer-events-none size-full object-cover outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
