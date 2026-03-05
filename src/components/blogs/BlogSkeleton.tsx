const BlogSkeleton = (): React.JSX.Element => {
  return (
    <div className="w-full flex flex-col items-start gap-4 p-6 rounded-2xl border border-border overflow-hidden bg-card">
      {/* Title */}
      <div className="h-5 sm:h-6 w-3/4 rounded-sm bg-muted animate-skeleton-shimmer" />

      {/* Description lines */}
      <div className="flex flex-col gap-2 w-full">
        <div className="h-3 sm:h-4 w-full rounded-sm animate-skeleton-shimmer bg-muted delay-100" />
        <div className="h-3 sm:h-4 w-[80%] rounded-sm animate-skeleton-shimmer bg-muted delay-200" />
      </div>

      {/* date & read time */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-2 w-full">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 rounded-full shrink-0 animate-skeleton-shimmer bg-muted-foreground/40 delay-150" />
          <div className="h-3 w-14 rounded-sm animate-skeleton-shimmer bg-muted delay-250" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 rounded-full shrink-0 animate-skeleton-shimmer bg-muted-foreground/40 delay-150" />
          <div className="h-3 w-12 rounded-sm animate-skeleton-shimmer bg-muted delay-300" />
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;
