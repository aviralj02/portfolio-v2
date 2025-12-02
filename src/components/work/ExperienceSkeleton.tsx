const ExperienceSkeleton = () => {
  return (
    <div className="flex flex-col divide-y divide-border/60 w-full animate-pulse">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 py-4">
          <div className="min-w-[36px] min-h-[36px]">
            <div className="w-9 h-9 bg-gray-400/40 rounded-md" />
          </div>

          <div className="flex flex-col flex-1 gap-2">
            <div className="flex items-center justify-between w-full">
              <div className="w-32 h-4 bg-gray-500/40 rounded" />

              <div className="w-20 h-3 bg-gray-400/40 rounded" />
            </div>

            <div className="w-24 h-3 bg-gray-400/40 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceSkeleton;
