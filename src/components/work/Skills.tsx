import React from "react";
import SkillType from "./SkillType";

type Props = {};

const Skills = (props: Props) => {
  return (
    <div className="flex flex-col md:grid grid-cols-2 gap-x-16 gap-y-10">
      {[1, 2, 3, 4].map((type) => (
        <SkillType key={type} />
      ))}
    </div>
  );
};

export default Skills;
