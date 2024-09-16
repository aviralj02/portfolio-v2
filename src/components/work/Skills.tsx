import React from "react";
import dynamic from "next/dynamic";

const Tag = dynamic(() => import("../Tag"), { ssr: false });

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

const SkillType = (props: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="sm:text-lg text-base font-medium text-muted-foreground">
        Languages
      </h3>
      <div className="flex gap-4 flex-wrap">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Tag key={item} />
        ))}
      </div>
    </div>
  );
};

export default Skills;
