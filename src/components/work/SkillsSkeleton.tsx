const SkillsSkeleton = (): React.JSX.Element => {
  return (
    <div className="flex flex-col md:grid grid-cols-2 gap-x-16 gap-y-10">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4">
          {/* Skill type title */}
          <div
            className="h-4 sm:h-5 w-24 rounded-sm bg-muted-foreground/20 animate-skeleton-shimmer"
            style={{ animationDelay: `${index * 0.1}s` }}
          />

          {/* Tag pills */}
          <div className="flex gap-4 flex-wrap">
            {Array.from({ length: 5 }).map((_, tagIndex) => (
              <div
                key={tagIndex}
                className="h-8 w-16 rounded-xl bg-muted-foreground/20 animate-skeleton-shimmer"
                style={{
                  animationDelay: `${index * 0.1 + (tagIndex + 1) * 0.05}s`,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsSkeleton;
