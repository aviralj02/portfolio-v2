"use client";

import { type RefObject, useRef, useState } from "react";
import { useTheme } from "next-themes";

import { GripVertical } from "lucide-react";
import { motion, Reorder, useDragControls } from "motion/react";

import { cn } from "@/lib/utils";

type Item = {
  id: string;
  label: string;
  sub: string;
};

type Shadow = { resting: string; lifted: string; socket: string };

const INITIAL_ITEMS: Item[] = [
  { id: "1", label: "Maya Chen", sub: "Product Designer" },
  { id: "2", label: "Ravi Patel", sub: "Frontend Engineer" },
  { id: "3", label: "Elena Kruger", sub: "UX Researcher" },
  { id: "4", label: "Sam Okafor", sub: "Backend Engineer" },
  { id: "5", label: "Nora Lindqvist", sub: "Product Manager" },
];

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/10.x/lorelei-neutral/svg?seed=${encodeURIComponent(seed)}`;

const SPRING = {
  type: "spring" as const,
  stiffness: 900,
  damping: 26,
  mass: 0.6,
};
const LIFT_SPRING = {
  type: "spring" as const,
  stiffness: 900,
  damping: 30,
  mass: 0.5,
};
const TILT_SPRING = {
  type: "spring" as const,
  stiffness: 600,
  damping: 20,
  mass: 0.5,
};

const ROW_HEIGHT = 64;
const ROW_GAP = 8;

const SHADOWS = {
  light: {
    resting: "0 1px 2px rgba(0,0,0,0.04)",
    lifted: "0 24px 32px rgba(0,0,0,0.18)",
    socket:
      "inset 0 2px 5px rgba(0,0,0,0.14), inset 0 -1px 1px rgba(255,255,255,0.6)",
  },
  dark: {
    resting: "0 1px 2px rgba(0,0,0,0.25)",
    lifted: "0 24px 40px rgba(0,0,0,0.65)",
    socket:
      "inset 0 2px 6px rgba(0,0,0,0.6), inset 0 -1px 1px rgba(255,255,255,0.04)",
  },
} as const;

export default function DraggableList() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const shadow = resolvedTheme === "dark" ? SHADOWS.dark : SHADOWS.light;
  const containerRef = useRef<HTMLUListElement>(null);

  const draggingIndex = draggingId
    ? items.findIndex((i) => i.id === draggingId)
    : -1;

  const containerHeight =
    items.length * ROW_HEIGHT + (items.length - 1) * ROW_GAP;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <Reorder.Group
        ref={containerRef}
        axis="y"
        values={items}
        onReorder={setItems}
        style={{ height: containerHeight }}
        className="flex flex-col gap-2 w-full max-w-xs"
      >
        {items.map((item, index) => {
          const isDragging = item.id === draggingId;
          const isNeighbor =
            draggingIndex !== -1 &&
            !isDragging &&
            Math.abs(index - draggingIndex) === 1;
          const tiltDir = index < draggingIndex ? -1 : 1;

          const rotate = isDragging ? 3 : isNeighbor ? tiltDir * 1.6 : 0;

          return (
            <DraggableRow
              key={item.id}
              item={item}
              isDragging={isDragging}
              rotate={rotate}
              shadow={shadow}
              containerRef={containerRef}
              onDragStart={() => setDraggingId(item.id)}
              onDragEnd={() => setDraggingId(null)}
            />
          );
        })}
      </Reorder.Group>
    </div>
  );
}

function DraggableRow({
  item,
  isDragging,
  rotate,
  shadow,
  containerRef,
  onDragStart,
  onDragEnd,
}: {
  item: Item;
  isDragging: boolean;
  rotate: number;
  shadow: Shadow;
  containerRef: RefObject<HTMLUListElement | null>;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={onDragEnd}
      whileDrag={{ zIndex: 50 }}
      style={{ zIndex: isDragging ? 50 : 1 }}
      transition={SPRING}
      dragConstraints={containerRef}
      dragElastic={0.12}
      className="select-none relative"
    >
      {/* SOCKET */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{
          opacity: isDragging ? 1 : 0,
          boxShadow: shadow.socket,
        }}
        transition={isDragging ? LIFT_SPRING : TILT_SPRING}
        className="absolute -inset-1 rounded-2xl bg-card border border-border/60"
      />

      <motion.div
        initial={false}
        animate={{
          rotate,
          scale: isDragging ? 1.03 : 1,
          boxShadow: isDragging ? shadow.lifted : shadow.resting,
        }}
        transition={isDragging ? LIFT_SPRING : TILT_SPRING}
        className={cn(
          "relative flex items-center gap-3 px-4 py-3 rounded-xl",
          "bg-card border border-border",
        )}
      >
        <div className="size-9 rounded-lg overflow-hidden shrink-0 bg-muted">
          <img
            src={avatarUrl(item.id)}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary truncate">
            {item.label}
          </p>
          <p className="text-xs text-muted-foreground truncate">{item.sub}</p>
        </div>

        <div
          role="button"
          aria-label={`Drag to reorder ${item.label}`}
          onPointerDown={(e) => {
            onDragStart();
            dragControls.start(e);
          }}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          className={cn(
            "p-1.5 -m-1.5 rounded-md group hover:bg-muted transition-all",
            isDragging ? "bg-muted" : "bg-transparent",
          )}
        >
          <GripVertical
            className={cn(
              "size-4 shrink-0 cursor-grab active:cursor-grabbing touch-none group-hover:text-primary/80 transition-all",
              isDragging ? "text-primary/80" : "text-muted-foreground/40",
            )}
          />
        </div>
      </motion.div>
    </Reorder.Item>
  );
}
