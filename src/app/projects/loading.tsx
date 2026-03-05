import PageWrapper from "@/components/PageWrapper";
import ProjectSkeleton from "@/components/projects/ProjectSkeleton";

export default function Loading() {
  return (
    <PageWrapper className="flex flex-col gap-8 sm:my-6 my-12">
      <div className="flex flex-col items-start text-primary gap-1">
        <h1 className="sm:text-2xl text-xl font-semibold">Projects</h1>
        <p className="sm:text-base text-sm text-muted-foreground">
          Here are some of the projects I&apos;ve worked on
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16">
        {Array.from({ length: 4 }).map((_, index: number) => (
          <ProjectSkeleton key={index} />
        ))}
      </div>
    </PageWrapper>
  );
}
