import PageWrapper from "@/components/PageWrapper";
import ProjectSkeleton from "@/components/projects/ProjectSkeleton";
import ExperienceSkeleton from "@/components/work/ExperienceSkeleton";

export default function Loading() {
  return (
    <PageWrapper className="flex flex-col gap-14 sm:my-6 my-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-start gap-2">
          <span className="text-xs font-medium tracking-widest uppercase text-secondary-text">
            Career
          </span>
          <h1 className="sm:text-2xl text-xl font-semibold text-primary">
            Experience
          </h1>
          <p className="sm:text-base text-sm text-muted-foreground">
            Every role left a mark — here&apos;s the timeline of places that
            shaped how I think and build.
          </p>
        </div>

        <ExperienceSkeleton />
      </div>

      <div id="projects" className="flex flex-col gap-8">
        <div className="flex flex-col items-start gap-2">
          <span className="text-xs font-medium tracking-widest uppercase text-secondary-text">
            Builds
          </span>
          <h2 className="sm:text-2xl text-xl font-semibold text-primary">
            Projects
          </h2>
          <p className="sm:text-base text-sm text-muted-foreground">
            Things I&apos;ve shipped, broken, fixed, and shipped again.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProjectSkeleton key={index} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
