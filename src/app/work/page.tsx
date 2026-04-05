import PageWrapper from "@/components/PageWrapper";
import ProjectCard from "@/components/projects/ProjectCard";
import ExperienceList from "@/components/work/ExperienceList";
import getExperiences from "@/lib/utils/get-experience";
import getProjects from "@/lib/utils/get-projects";

const Work = async (): Promise<React.JSX.Element> => {
  const timelineData = await getExperiences();
  const projects = await getProjects();

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

        <ExperienceList data={timelineData} />
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
          {projects?.map((project: Project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Work;
