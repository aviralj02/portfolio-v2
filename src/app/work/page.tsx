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
        <div className="flex flex-col items-start gap-1">
          <h1 className="sm:text-2xl text-xl font-semibold text-primary">
            Work Experience
          </h1>
          <p className="sm:text-base text-sm text-muted-foreground">
            Growing through hands-on experience, here&apos;s a glimpse into my
            professional journey so far
          </p>
        </div>

        <ExperienceList data={timelineData} />
      </div>

      <div id="projects" className="flex flex-col gap-8">
        <div className="flex flex-col items-start gap-1">
          <h2 className="sm:text-2xl text-xl font-semibold text-primary">
            Projects
          </h2>
          <p className="sm:text-base text-sm text-muted-foreground">
            Here are some of the projects I&apos;ve worked on
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects?.map((project: Project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Work;
