import React from "react";
import SpotifyIcon from "@/components/icons/SpotifyIcon";
import { fetchSpotifyData } from "@/lib/spotify/api";
import { cn } from "@/lib/utils";
import { HeadphoneOffIcon } from "lucide-react";

type Props = {};

const SpotifyTile = async (props: Props) => {
  const currentlyPlaying = await fetchSpotifyData();

  return (
    <div
      className={cn(
        "aspect-square lg:order-5 order-7",
        "flex flex-col bg-card rounded-2xl box-border p-3 sm:p-5",
        currentlyPlaying.isPlaying ? "justify-between" : "gap-6"
      )}
    >
      <div className="flex justify-between items-center w-full">
        <SpotifyIcon className="w-[10vw] h-[10vw] max-w-14 max-h-14 opacity-75 grayscale-[40%]" />
        {currentlyPlaying.isPlaying ? (
          <div className="flex gap-1">
            <div className="animate-quiet w-1 sm:h-6 h-5 bg-secondary-text rounded-full" />
            <div className="animate-loud w-1 sm:h-6 h-5 bg-secondary-text rounded-full" />
            <div className="animate-decent w-1 sm:h-6 h-5 bg-secondary-text rounded-full" />
            <div className="hidden sm:inline-block animate-quiet w-1 sm:h-6 h-5 bg-secondary-text rounded-full" />
          </div>
        ) : null}
      </div>

      {currentlyPlaying.isPlaying ? (
        <div className="flex flex-col">
          <h3 className="text-lg sm:text-2xl font-semibold leading-tight">
            {currentlyPlaying.title}
          </h3>
          <span className="text-xs sm:text-base text-muted-foreground leading-tight">
            {currentlyPlaying.artist}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <span>Offline</span>
          <HeadphoneOffIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default SpotifyTile;
