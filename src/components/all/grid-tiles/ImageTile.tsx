"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import React from "react";

const ImageTile = () => {
  const { theme } = useTheme();
  return (
    <div
      className={cn(
        "aspect-square order-4",
        "bg-card rounded-2xl overflow-hidden w-full"
      )}
    >
      <img
        src={
          theme === "dark"
            ? "/assets/bg-tile-image-dark.jpg"
            : "/assets/bg-tile-image-light.jpg"
        }
        alt="image-tile"
        className="rounded-2xl object-cover w-full h-full"
        draggable={false}
      />
    </div>
  );
};

export default ImageTile;
