"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "next-view-transitions";

import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  craft: Craft;
  videoUrl?: string;
  placeholder?: string;
};

const CraftCard = ({ craft, videoUrl, placeholder }: Props) => {
  const [ready, setReady] = useState(false);
  const [near, setNear] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only fetch a preview once it's close to the screen, and only play it
  // while it's actually there.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      href={`/craft/${craft.slug}`}
      className={cn(
        "group h-full flex flex-col gap-3 rounded-2xl",
        "card-glass bg-card/30 hover:card-glass-lift overflow-hidden",
        "duration-200 transition-[box-shadow,background-color]"
      )}
    >
      <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-secondary/70">
        {/* A blurred first frame holds the spot until the video can play, then
            fades out over the same frame. Falls back to a gradient. */}
        {placeholder ? (
          <img
            src={placeholder}
            alt=""
            aria-hidden
            className={cn(
              "absolute inset-0 size-full scale-110 object-cover blur-xl transition-opacity duration-700 ease-out",
              ready ? "opacity-0" : "opacity-100"
            )}
          />
        ) : (
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 bg-linear-to-br from-muted via-secondary to-muted transition-opacity duration-700 ease-out",
              ready ? "opacity-0" : "opacity-100"
            )}
          />
        )}

        {videoUrl && (
          <video
            ref={videoRef}
            src={near ? videoUrl : undefined}
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
