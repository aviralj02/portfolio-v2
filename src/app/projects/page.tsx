import PageWrapper from "@/components/PageWrapper";
import ProjectCard from "@/components/projects/ProjectCard";
import React from "react";

type Props = {};

type ProjectType = {
  title: string;
  description: string;
  live?: string;
  github: string;
  banner: string;
  icon: string;
  stack: string[];
};

const Projects = (props: Props) => {
  const projects: ProjectType[] = [
    {
      title: "docu-inquire",
      description:
        "Platform allowing users to engage in conversational interactions with PDF documents using LLM by Open AI.",
      live: "https://docu-inquire.vercel.app/",
      github: "https://github.com/aviralj02/docu-inquire",
      banner: process.env.DUMMY_BANNER_LINK!,
      icon: process.env.DUMMY_ICON_LINK!,
      stack: [
        "Typescript",
        "Next.js",
        "tRPC",
        "Prisma",
        "Tailwind CSS",
        "MySQL",
      ],
    },
    {
      title: "docu-inquire",
      description:
        "Platform allowing users to engage in conversational interactions with PDF documents using LLM by Open AI.",
      live: "https://docu-inquire.vercel.app/",
      github: "https://github.com/aviralj02/docu-inquire",
      banner: process.env.DUMMY_BANNER_LINK!,
      icon: process.env.DUMMY_ICON_LINK!,
      stack: [
        "Typescript",
        "Next.js",
        "tRPC",
        "Prisma",
        "Tailwind CSS",
        "MySQL",
      ],
    },
    {
      title: "docu-inquire",
      description:
        "Platform allowing users to engage in conversational interactions with PDF documents using LLM by Open AI.",
      live: "https://docu-inquire.vercel.app/",
      github: "https://github.com/aviralj02/docu-inquire",
      banner: process.env.DUMMY_BANNER_LINK!,
      icon: process.env.DUMMY_ICON_LINK!,
      stack: [
        "Typescript",
        "Next.js",
        "tRPC",
        "Prisma",
        "Tailwind CSS",
        "MySQL",
      ],
    },
  ];

  return (
    <PageWrapper className="flex flex-col sm:my-12 my-6 gap-8">
      <div className="flex flex-col items-start text-primary gap-1">
        <h1 className="sm:text-2xl text-xl font-medium">Projects</h1>
        <p className="sm:text-base text-sm text-muted-foreground">
          Here are some of the projects I've worked on
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16">
        {projects.map((project: ProjectType, index: number) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </PageWrapper>
  );
};

export default Projects;
