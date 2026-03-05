const ProjectSkeleton = (): React.JSX.Element => {
  return (
    <div className="relative flex flex-col w-full rounded-3xl h-fit overflow-hidden border border-border bg-card">
      {/* Header strip */}
      <div className="h-14 w-full rounded-t-3xl bg-muted animate-skeleton-shimmer" />

      {/* Icon placeholder */}
      <div className="absolute top-5 left-5 w-20 h-20 rounded-full border-4 border-card bg-muted animate-skeleton-shimmer shrink-0 delay-50" />

      {/* Content */}
      <div className="bg-card flex flex-col gap-6 w-full p-5 rounded-3xl -mt-3 relative z-10">
        <div className="flex items-center gap-3 rounded-full w-fit self-end">
          <div className="w-5 h-5 rounded-full bg-muted-foreground/40 animate-skeleton-shimmer delay-50" />
          <div className="w-5 h-5 rounded-full bg-muted-foreground/40 animate-skeleton-shimmer delay-150" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="h-6 w-3/4 rounded-sm bg-muted animate-skeleton-shimmer delay-50" />
          <div className="h-4 w-full rounded-sm bg-muted animate-skeleton-shimmer delay-50" />
          <div className="h-4 w-5/6 rounded-sm bg-muted animate-skeleton-shimmer delay-100" />

          <div className="flex gap-2 flex-wrap mt-2">
            <div className="w-12 h-4 rounded-sm bg-muted animate-skeleton-shimmer delay-200" />
            <div className="w-12 h-4 rounded-sm bg-muted animate-skeleton-shimmer delay-250" />
            <div className="w-12 h-4 rounded-sm bg-muted animate-skeleton-shimmer delay-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSkeleton;
