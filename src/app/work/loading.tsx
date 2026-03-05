import PageWrapper from "@/components/PageWrapper";
import ExperienceSkeleton from "@/components/work/ExperienceSkeleton";
import SkillsSkeleton from "@/components/work/SkillsSkeleton";

export default function Loading() {
  return (
    <PageWrapper className="flex flex-col gap-14 sm:my-6 my-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-start gap-1">
          <h1 className="sm:text-2xl text-xl font-semibold text-primary">
            Work Experience
          </h1>
          <p className="sm:text-base text-sm text-muted-foreground">
            Growing through hands-on experience, here&apos;s a glimpse into my
            professional journey so far
          </p>
        </div>

        <ExperienceSkeleton />
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-start gap-1">
          <h2 className="sm:text-2xl text-xl font-semibold text-primary">
            Skills
          </h2>
          <p className="sm:text-base text-sm text-muted-foreground">
            Technologies I&apos;m currently experienced with, yet always eager
            to learn and adapt to new advancements and tools.
          </p>
        </div>

        <SkillsSkeleton />
      </div>
    </PageWrapper>
  );
}
