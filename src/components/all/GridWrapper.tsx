import React, { FC, ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const GridWrapper: FC<Props> = ({ children }: Props): ReactElement => {
  return (
    <div className="grid lg:grid-cols-4 grid-cols-2 w-full max-w-md lg:max-w-full mx-auto items-stretch gap-4 lg:gap-8 my-6">
      {children}
    </div>
  );
};

export default GridWrapper;
