"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import WobbleTabs from "./tabs";

export default function WobbleTabsCraft() {
  const [value, setValue] = useState(1);
  const [slow, setSlow] = useState(false);

  return (
    <div className="flex w-full grow flex-col items-center justify-end gap-8">
      <div className="flex grow items-center">
        <WobbleTabs value={value} onValueChangeAction={setValue} slow={slow} />
      </div>

      <button
        type="button"
        onClick={() => setSlow((previous) => !previous)}
        aria-pressed={slow}
        className={cn(
          "cursor-pointer rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
          slow
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground hover:text-primary",
        )}
      >
        Slow motion: {slow ? "On" : "Off"}
      </button>
    </div>
  );
}
