import React, { FC, ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const GridWrapper: FC<Props> = ({ children }: Props): ReactElement => {
  return (
    <div className="grid lg:grid-cols-4 grid-cols-2 w-full auto-rows-[minmax(0,200px)] items-stretch gap-8 my-6">
      {children}
    </div>
  );
};

export default GridWrapper;
