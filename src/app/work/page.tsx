"use client";

import PageWrapper from "@/components/PageWrapper";
import Skills from "@/components/work/Skills";
import Timeline from "@/components/work/Timeline";
import React from "react";

type Props = {};

type Experience = {
  title: string;
  position: string;
  dates: string;
};

const Work = (props: Props) => {
  const timelineData: Experience[] = [
    {
      title: "TrillionSale",
      position: "Frontend Developer Intern",
      dates: "June 2024 - August 2024",
    },
    {
      title: "Flabs",
      position: "Software Developer Intern",
      dates: "October 2023 - March 2024",
    },
    {
      title: "Cyberpeace Foundation",
      position: "Full Stack Developer Intern",
      dates: "June 2023 - August 2023",
    },
  ];

  return (
    <PageWrapper className="flex flex-col my-14 gap-20">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-start gap-1">
          <h1 className="sm:text-2xl text-xl font-medium text-primary">
            Work Experience
          </h1>
          <p className="sm:text-base text-sm text-muted-foreground">
            Growing through hands-on experience, here&apos;s a glimpse into my
            professional journey so far.
          </p>
        </div>

        <Timeline data={timelineData} />
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-start gap-1">
          <h2 className="sm:text-2xl text-xl font-medium text-primary">
            Skills
          </h2>
          <p className="sm:text-base text-sm text-muted-foreground">
            Technologies I&apos;m currently experienced with, yet always eager
            to learn and adapt to new advancements and tools.
          </p>
        </div>

        <Skills />
      </div>
    </PageWrapper>
  );
};

export default Work;
