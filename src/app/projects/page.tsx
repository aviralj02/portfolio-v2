"use client";

import PageWrapper from "@/components/PageWrapper";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectSkeleton from "@/components/projects/ProjectSkeleton";
import getProjects from "@/lib/utils/get-projects";
import React, { ReactElement, useEffect, useState } from "react";

type Props = {};

const Projects = (props: Props): ReactElement => {
  const [projects, setProjects] = useState<Project[]>();

  const fetchProjects = async () => {
    const projectsData = await getProjects();
    setProjects(projectsData);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <PageWrapper className="flex flex-col gap-8 sm:my-12 my-6">
      <div className="flex flex-col items-start text-primary gap-1">
        <h1 className="sm:text-2xl text-xl font-medium">Projects</h1>
        <p className="sm:text-base text-sm text-muted-foreground">
          Here are some of the projects I&apos;ve worked on
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16">
        {projects
          ? projects.map((project: Project) => (
              <ProjectCard key={project.title} project={project} />
            ))
          : Array.from({ length: 4 }).map((_, index: number) => (
              <ProjectSkeleton key={index} />
            ))}
      </div>
    </PageWrapper>
  );
};

export default Projects;
