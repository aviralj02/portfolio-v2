import PageWrapper from "@/components/PageWrapper";
import PenTitle from "@/components/PenTitle";
import ProjectCard from "@/components/projects/ProjectCard";
import ExperienceTimeline from "@/components/work/ExperienceTimeline";
import workTitle from "@/components/work/work-title-paths";
import { buildTimeline } from "@/lib/experience";
import getExperiences from "@/lib/utils/get-experience";
import getProjects from "@/lib/utils/get-projects";

export const revalidate = 86400;

const Section = ({
  label,
  blurb,
  id,
  children,
}: {
  label: string;
  blurb: string;
  id?: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="flex flex-col gap-6">
    <div className="flex flex-col gap-2">
      <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
        {label}
      </h2>
      <p className="w-full max-w-[58ch] text-pretty text-sm text-muted-foreground">
        {blurb}
      </p>
    </div>

    {children}
  </section>
);

const Work = async (): Promise<React.JSX.Element> => {
  const [timelineData, projects] = await Promise.all([
    getExperiences(),
    getProjects(),
  ]);

  const timeline = buildTimeline(timelineData, new Date().toISOString());

  return (
    <PageWrapper className="flex flex-col gap-14">
      <div className="flex flex-col items-start gap-2 text-primary">
        <span className="text-xs font-medium uppercase tracking-widest text-secondary-text">
          Career
        </span>

        <PenTitle title={workTitle} />

        <p className="w-full max-w-[58ch] text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          Where I&apos;ve worked, and what I&apos;ve built along the way.
        </p>
      </div>

      <Section
        label="Experience"
        blurb="Every role left a mark — here's the timeline of places that shaped how I think and build."
      >
        {timeline && <ExperienceTimeline timeline={timeline} />}
      </Section>

      <Section
        id="projects"
        label="Projects"
        blurb="Things I've shipped, broken, fixed, and shipped again."
      >
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project: Project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </Section>
    </PageWrapper>
  );
};

export default Work;
