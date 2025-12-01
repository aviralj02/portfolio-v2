"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const ImageTile = dynamic(
  () => import("@/components/all/grid-tiles/ImageTile"),
  {
    ssr: false,
    loading: () => (
      <div
        className={cn(
          "aspect-square order-4",
          "bg-card rounded-2xl overflow-hidden w-full card-shadow animate-pulse"
        )}
      />
    ),
  }
);

export default function ClientImageTile() {
  return <ImageTile />;
}
