import React from "react";

type Props = {
  data: Experience[];
};

type Experience = {
  title: string;
  position: string;
  dates: string;
};

const Timeline = ({ data }: Props) => {
  return (
    <div className="flex flex-col space-y-8 max-w-2xl w-full">
      {data.map((item, index) => (
        <div key={index} className="flex items-start">
          <div className="relative flex flex-col items-center">
            <div className="w-4 h-4 bg-dim rounded-full flex-shrink-0 hover:bg-secondary-text" />
            {index !== data.length - 1 && (
              <div className="absolute top-4 w-[2px] h-8 my-4 bg-dim rounded-full" />
            )}
          </div>
          <div className="ml-8 w-full">
            <h3 className="text-primary font-medium sm:text-lg text-base">
              {item.title}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between sm:text-base text-sm">
              <p className="text-primary leading-relaxed">{item.position}</p>
              <p className="text-dim">{item.dates}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
