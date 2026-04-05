const ProjectSkeleton = (): React.JSX.Element => {
  return (
    <div className="w-full flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
      {/* Color accent bar */}
      <div className="w-1 self-stretch rounded-full bg-muted animate-skeleton-shimmer shrink-0" />

      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-muted animate-skeleton-shimmer shrink-0" />

      {/* Text */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="h-3.5 w-1/3 rounded bg-muted animate-skeleton-shimmer" />
        <div className="h-3 w-1/2 rounded bg-muted animate-skeleton-shimmer" />
      </div>

      {/* Arrow */}
      <div className="w-4 h-4 rounded bg-muted animate-skeleton-shimmer shrink-0" />
    </div>
  );
};

export default ProjectSkeleton;
