"use client";

import { useRef, useState } from "react";

import { MotionConfig, type PanInfo } from "motion/react";

import { Cover } from "./cover";
import { PHOTOS } from "./shared";
import { Thumbnail } from "./thumbnail";

type Returning = { id: string; x: number; y: number };

export default function CoverDrop() {
  const [cover, setCover] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const [returning, setReturning] = useState<Returning | null>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const isOver = ({ point }: PanInfo) => {
    const rect = coverRef.current?.getBoundingClientRect();
    if (!rect) return false;
    const x = point.x - window.scrollX;
    const y = point.y - window.scrollY;
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  };

  // The thumbnail starts its way home from the centre of the cover.
  const sendBack = (id: string) => {
    const from = coverRef.current?.getBoundingClientRect();
    const to = slotRefs.current[id]?.getBoundingClientRect();
    if (!from || !to) return;
    setReturning({
      id,
      x: from.left + from.width / 2 - (to.left + to.width / 2),
      y: from.top + from.height / 2 - (to.top + to.height / 2),
    });
  };

  const choose = (id: string) => {
    if (cover && cover !== id) sendBack(cover);
    setCover(id);
  };

  const remove = () => {
    if (cover) sendBack(cover);
    setCover(null);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex w-full grow items-center justify-center gap-10 select-none">
        <ul aria-label="Photos" className="flex flex-col gap-2.5">
          {PHOTOS.map((photo) => (
            <li
              key={photo.id}
              ref={(el) => {
                slotRefs.current[photo.id] = el;
              }}
              className="relative size-16 rounded-xl bg-muted shadow-[inset_0_1px_2px_rgb(0_0_0/0.08)]"
            >
              <Thumbnail
                photo={photo}
                hidden={photo.id === cover}
                returnFrom={returning?.id === photo.id ? returning : null}
                onReturned={() => setReturning(null)}
                onPick={() => choose(photo.id)}
                onDrag={(info) => setOver(isOver(info))}
                onDrop={(info) => {
                  if (isOver(info)) choose(photo.id);
                  setOver(false);
                }}
              />
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Cover
          </span>
          <Cover
            ref={coverRef}
            photo={PHOTOS.find((p) => p.id === cover)}
            over={over}
            onRemove={remove}
          />
        </div>
      </div>
    </MotionConfig>
  );
}
