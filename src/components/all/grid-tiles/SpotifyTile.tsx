import SpotifyIcon from "@/components/icons/SpotifyIcon";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {};

const Spotify = (props: Props) => {
  return (
    <div
      className={cn(
        "aspect-square lg:order-5 order-7",
        "flex flex-col justify-between bg-card rounded-2xl box-border p-3 sm:p-5"
      )}
    >
      <div className="flex justify-between items-center w-full">
        <SpotifyIcon className="w-[10vw] h-[10vw] max-w-14 max-h-14 opacity-75 grayscale-[40%]" />
        <div className="flex gap-1">
          <div className="animate-quiet w-1 sm:h-6 h-5 bg-secondary-text rounded-full" />
          <div className="animate-loud w-1 sm:h-6 h-5 bg-secondary-text rounded-full" />
          <div className="animate-decent w-1 sm:h-6 h-5 bg-secondary-text rounded-full" />
          <div className="hidden sm:inline-block animate-quiet w-1 sm:h-6 h-5 bg-secondary-text rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-lg sm:text-2xl font-semibold leading-tight">
          Song Title
        </h3>
        <span className="text-xs sm:text-base text-muted-foreground leading-tight">
          Singer
        </span>
      </div>
    </div>
  );
};

export default Spotify;
