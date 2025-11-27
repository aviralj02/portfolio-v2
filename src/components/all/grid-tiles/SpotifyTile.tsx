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
        "flex flex-col bg-card rounded-2xl box-border w-full card-shadow"
      )}
    >
      <div className="relative rounded-t-2xl h-1/3 w-full">
        <div
          className="absolute inset-0 rounded-t-2xl bg-cover bg-no-repeat"
          style={{
            opacity: currentlyPlaying.isPlaying ? 0.7 : 1,
            backgroundColor: currentlyPlaying.isPlaying ? "" : "#1ED760",
            backgroundImage: currentlyPlaying.isPlaying
              ? `url(${currentlyPlaying.albumImageUrl})`
              : "",
          }}
        />

        <div className="absolute right-3 bottom-2 bg-black w-fit p-[3px] rounded-full z-10">
          <SpotifyIcon className="w-[6vw] h-[6vw] max-w-8 max-h-8" />
        </div>
      </div>

      <div className="flex flex-col flex-grow justify-between px-3 sm:px-5 py-3 sm:py-4">
        {currentlyPlaying.isPlaying ? (
          <a
            className="flex flex-col"
            target="_blank"
            rel="noreferrer"
            href={currentlyPlaying.songUrl}
          >
            <h3 className="text-lg sm:text-xl font-semibold leading-tight">
              {currentlyPlaying.title}
            </h3>
            <span className="text-xs sm:text-sm text-muted-foreground leading-tight">
              {currentlyPlaying.artist}
            </span>
          </a>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm sm:text-lg text text-muted-foreground font-mono font-semibold">
              Offline
            </span>
            <HeadphoneOffIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </div>
        )}

        {currentlyPlaying.isPlaying ? (
          <div className="flex gap-1 self-end">
            <div className="animate-quiet w-[3px] sm:h-6 h-4 bg-secondary-text rounded-full" />
            <div className="animate-loud w-[3px] sm:h-6 h-4 bg-secondary-text rounded-full" />
            <div className="animate-decent w-[3px] sm:h-6 h-4 bg-secondary-text rounded-full" />
            <div className="hidden sm:inline-block animate-quiet w-[3px] sm:h-6 h-4 bg-secondary-text rounded-full" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SpotifyTile;
