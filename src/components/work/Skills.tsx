import React from "react";
import { TagSize } from "@/types/enums";
import Tag from "../Tag";

type Props = {
  data: Skill[] | undefined;
};

const Skills = ({ data }: Props) => {
  return (
    <div className="flex flex-col md:grid grid-cols-2 gap-x-16 gap-y-10">
      {data?.map((skill) => (
        <SkillType key={skill.skillType} skill={skill} />
      ))}
    </div>
  );
};

const SkillType = ({ skill }: { skill: Skill }) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="sm:text-lg text-base font-medium text-muted-foreground">
        {skill.skillType}
      </h3>
      <div className="flex gap-4 flex-wrap">
        {skill.competencies.map((competency) => (
          <Tag key={competency} name={competency} size={TagSize.Large} />
        ))}
      </div>
    </div>
  );
};

export default Skills;
