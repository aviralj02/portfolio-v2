import { cn } from "@/lib/utils";
import React, { FC, ReactElement, ReactNode } from "react";

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
        "mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
