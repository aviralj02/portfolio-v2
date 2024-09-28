import React from "react";

type Props = {};

const ProjectSkeleton = (props: Props) => {
  return (
    <div className="relative flex flex-col w-full rounded-3xl h-fit animate-pulse bg-gray-200">
      <div className="bg-gray-600 h-14 w-full rounded-t-3xl" />

      <div className="absolute top-5 left-5 w-20 h-20 rounded-full bg-gray-400 border-[6px] border-card" />

      <div className="bg-gray-400 flex flex-col gap-6 w-full p-5 rounded-b-3xl">
        <div className="flex items-center gap-3 rounded-full w-fit self-end">
          <div className="w-5 h-5 bg-gray-500 rounded-full" />
          <div className="w-5 h-5 bg-gray-500 rounded-full" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="h-6 bg-gray-500 rounded w-3/4" />
          <div className="h-4 bg-gray-500 rounded w-full" />
          <div className="h-4 bg-gray-500 rounded w-5/6" />

          <div className="flex gap-2 flex-wrap mt-2">
            <div className="w-12 h-4 bg-gray-500 rounded" />
            <div className="w-12 h-4 bg-gray-500 rounded" />
            <div className="w-12 h-4 bg-gray-500 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSkeleton;
