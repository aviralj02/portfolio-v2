"use client";

import dynamic from "next/dynamic";

const ImageTile = dynamic(
  () => import("@/components/all/grid-tiles/ImageTile"),
  {
    ssr: false,
  }
);

export default function ClientImageTile() {
  return <ImageTile />;
}
