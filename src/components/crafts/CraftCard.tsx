"use client";

import { useState } from "react";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  craft: Craft;
  videoUrl?: string;
};

const CraftCard = ({ craft, videoUrl }: Props) => {
  const [ready, setReady] = useState(false);

  return (
    <Link
      href={`/craft/${craft.slug}`}
      className={cn(
        "group h-full flex flex-col gap-3 rounded-2xl",
        "bg-card/30 border border-border hover:border-primary/20 overflow-hidden",
        "duration-200 transition-colors"
      )}
    >
      <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-secondary/70">
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 bg-linear-to-br from-muted via-secondary to-muted transition-opacity duration-700 ease-out",
            ready ? "opacity-0" : "opacity-100"
          )}
        />

        {videoUrl && (
          <video
            src={videoUrl}
            className={cn(
              "relative w-full h-full object-cover transition-opacity duration-700 ease-out",
              ready ? "opacity-100" : "opacity-0"
            )}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={`${craft.title} preview`}
            onLoadedData={() => setReady(true)}
          />
        )}
      </div>

      <div className="flex flex-col gap-1 p-4">
        <h2 className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          <span>{craft.title}</span>
          <ArrowUpRight
            aria-hidden
            className="size-3.5 text-muted-foreground opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
          />
        </h2>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {craft.description}
        </p>
      </div>
    </Link>
  );
};

export default CraftCard;
