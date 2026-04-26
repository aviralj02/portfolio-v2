const ExperienceSkeleton = (): React.JSX.Element => {
  return (
    <div className="flex flex-col divide-y divide-border/60 w-full">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 py-4 rounded-lg pr-4 pl-2"
        >
          <div className="min-w-[36px] min-h-[36px] shrink-0">
            <div
              className="w-9 h-9 rounded-md bg-muted-foreground/20 animate-skeleton-shimmer"
              style={{ animationDelay: `${index * 0.05 + 0.05}s` }}
            />
          </div>

          <div className="flex flex-col sm:flex-row flex-1 gap-1 w-full items-start justify-between">
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div
                className="w-32 h-4 rounded-sm bg-muted-foreground/20 animate-skeleton-shimmer"
                style={{ animationDelay: `${index * 0.05 + 0.1}s` }}
              />
              <div
                className="w-24 h-3 rounded-sm bg-muted-foreground/40 animate-skeleton-shimmer"
                style={{ animationDelay: `${index * 0.05 + 0.15}s` }}
              />
            </div>

            <div
              className="w-20 h-3 rounded-sm bg-muted-foreground/40 animate-skeleton-shimmer shrink-0"
              style={{ animationDelay: `${index * 0.05 + 0.2}s` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceSkeleton;
