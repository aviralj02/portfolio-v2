import React from "react";

type Props = {};

const BlogSkeleton = (props: Props) => {
  return (
    <div className="w-full flex flex-col items-start gap-4 p-6 bg-gray-400 rounded-2xl animate-pulse">
      <div className="h-6 w-3/4 bg-gray-500 rounded" />

      <div className="h-4 w-full bg-gray-500 rounded" />
      <div className="h-4 w-full bg-gray-500 rounded" />

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-4 w-full">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-600 rounded-full" />
          <div className="h-3 w-16 bg-gray-500 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-600 rounded-full" />
          <div className="h-3 w-12 bg-gray-500 rounded" />
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;
