import React, { FC, ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

const PageWrapper: FC<Props> = ({
  children,
  className,
}: Props): ReactElement => {
  return (
    <div
      className={cn(
        "mx-auto w-full min-w-0 max-w-6xl px-6 md:px-20",
        "pt-26.5 pb-24 sm:pt-30.5 sm:pb-32",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
