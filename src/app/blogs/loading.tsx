import BlogSkeleton from "@/components/blogs/BlogSkeleton";
import PageWrapper from "@/components/PageWrapper";

export default function Loading() {
  return (
    <PageWrapper className="flex flex-col gap-8 sm:my-6 my-12">
      <div className="flex flex-col items-start text-primary gap-1">
        <h1 className="sm:text-2xl text-xl font-semibold">Blogs</h1>
        <p className="sm:text-base text-sm text-muted-foreground">
          I share my experiences as a developer, writing blogs on various topics
        </p>
      </div>

      <div className="w-full flex flex-col gap-6">
        {Array.from({ length: 4 }).map((_, index: number) => (
          <BlogSkeleton key={index} />
        ))}
      </div>
    </PageWrapper>
  );
}
