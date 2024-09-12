import dynamic from "next/dynamic";
import React from "react";

const Tag = dynamic(() => import("../Tag"), { ssr: false });

type Props = {};

const SkillType = (props: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="sm:text-lg text-base font-medium opacity-60">Languages</h3>
      <div className="flex gap-4 flex-wrap">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Tag key={item} />
        ))}
      </div>
    </div>
  );
};

export default SkillType;
