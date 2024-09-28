import React from "react";

type Props = {};

const TimelineSkeleton = (props: Props) => {
  return (
    <div className="flex flex-col space-y-8 w-full">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-start group">
          <div className="relative flex flex-col items-center">
            <div className="w-4 h-4 bg-gray-400 rounded-full flex-shrink-0" />
            {index !== 3 && (
              <div className="absolute top-4 w-[2px] h-8 my-4 bg-gray-400 rounded-full" />
            )}
          </div>

          <div className="flex flex-col gap-1 items-start sm:flex-row sm:items-end sm:justify-between sm:gap-0 ml-8 w-full">
            <div className="flex flex-col space-y-2">
              <div className="w-32 h-6 bg-gray-500 rounded" />
              <div className="w-24 h-4 bg-gray-400 rounded" />
            </div>

            <div className="w-16 h-4 bg-gray-400 rounded sm:text-base text-sm" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineSkeleton;
