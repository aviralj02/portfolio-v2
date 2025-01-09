import PageWrapper from "@/components/PageWrapper";
import Skills from "@/components/work/Skills";
import Timeline from "@/components/work/Timeline";
import TimelineSkeleton from "@/components/work/TimelineSkeleton";
import getExperiences from "@/lib/utils/get-experience";
import getSkills from "@/lib/utils/get-skills";
import React, { ReactElement } from "react";

type Props = {};

const Work = async (props: Props): Promise<ReactElement> => {
  const experience: Experience[] | undefined = await getExperiences();
  const skills: Skill[] | undefined = await getSkills();

  return (
    <PageWrapper className="flex flex-col gap-20 sm:my-12 my-6">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-start gap-1">
          <h1 className="sm:text-2xl text-xl font-medium text-primary">
            Work Experience
          </h1>
          <p className="sm:text-base text-sm text-muted-foreground">
            Growing through hands-on experience, here&apos;s a glimpse into my
            professional journey so far
          </p>
        </div>

        {experience ? <Timeline data={experience} /> : <TimelineSkeleton />}
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

        <Skills data={skills} />
      </div>
    </PageWrapper>
  );
};

export default Work;
