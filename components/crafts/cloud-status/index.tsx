"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import CloudStatus, { type BubbleVariant, type StatusUser } from "./cloud";

const USER: StatusUser = {
  name: "Aviral",
  avatar: (
    <Image
      src="/assets/profile-image.png"
      alt=""
      width={112}
      height={112}
      className="size-full object-cover"
    />
  ),
};

const VARIANTS: ReadonlyArray<{ id: BubbleVariant; label: string }> = [
  { id: "thought", label: "Thought" },
  { id: "message", label: "Message" },
];

export default function CloudStatusCraft() {
  const [variant, setVariant] = useState<BubbleVariant>("thought");

  return (
    <div className="flex w-full grow flex-col items-center justify-end gap-8">
      <div className="flex grow items-center">
        <CloudStatus
          user={USER}
          status="Tuning a spring, back soon"
          variant={variant}
        />
      </div>

      <div
        role="group"
        aria-label="Bubble"
        className="flex items-center gap-1 rounded-full bg-secondary p-1"
      >
        {VARIANTS.map((option) => {
          const active = option.id === variant;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => setVariant(option.id)}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-primary",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
