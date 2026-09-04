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
      className={cn(
        "page-enter mx-auto w-full min-w-0 max-w-6xl px-6 md:px-20",
        "pt-26.5 pb-24 sm:pt-30.5 sm:pb-32",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
