"use client";

import React, { FC, ReactElement, ReactNode } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * The shell — header, nav, footer — never unmounts, so a route change should
 * read as the middle of the page settling rather than as arriving somewhere
 * new. The entrance is therefore a short dissolve with no travel: movement is
 * what announces "different page", and announcing it is the thing we don't
 * want.
 *
 * Keying on the pathname is what replays it. Both routes render this same
 * component in the same slot, so React would otherwise reuse the DOM node and
 * the animation would only ever run once, on the first load.
 */
const PageWrapper: FC<Props> = ({
  children,
  className,
}: Props): ReactElement => {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      /* A CSS animation rather than a motion one: it starts painting with the
         first frame of HTML instead of waiting for hydration, which matters
         most on the cold load where the delay was visible. */
      /* Measure and vertical rhythm live here rather than on each page: the
         gap under the header is one decision, and it was previously five —
         with `sm:my-6 my-12` the desktop gap was half the mobile one, and the
         home page had none at all. The generous pb replaces the footer as the
         thing that stops the page ending on its last line. */
      className={cn(
        /* min-w-0: this is a grid item, so `min-width: auto` resolves to its
           min-content — a horizontally scrolling child would otherwise
           push the whole page wider than the screen. */
        "page-enter mx-auto w-full min-w-0 max-w-6xl px-6 md:px-20",
        "pt-10 pb-24 sm:pt-14 sm:pb-32",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
