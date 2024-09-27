import { formatDateToMonthYear } from "@/lib/utils";
import React from "react";

type Props = {
  data: Experience[] | undefined;
};

const Timeline = ({ data }: Props) => {
  return (
    <div className="flex flex-col space-y-8 w-full">
      {data?.map((item, index) => (
        <div key={index} className="flex items-start group">
          <div className="relative flex flex-col items-center">
            <div className="w-4 h-4 bg-dim rounded-full flex-shrink-0 group-hover:bg-secondary-text transition-all" />
            {index !== data.length - 1 && (
              <div className="absolute top-4 w-[2px] h-8 my-4 bg-dim rounded-full" />
            )}
          </div>

          <div className="flex flex-col items-start sm:flex-row sm:items-end sm:justify-between ml-8 w-full">
            <a
              href={item.url}
              rel="noreferrer"
              target="_blank"
              className="flex flex-col"
            >
              <h3 className="text-primary font-medium sm:text-lg text-base">
                {item.companyName}
              </h3>
              <p className="text-muted-foreground leading-relaxed sm:text-base text-sm">
                {item.role}
              </p>
            </a>

            <p className="text-dim sm:text-base text-sm">
              <span>{formatDateToMonthYear(new Date(item.startDate))}</span>
              <span> - </span>
              {item.currentlyWorking === true ? (
                <span>Present</span>
              ) : (
                <span>{formatDateToMonthYear(new Date(item.endDate))}</span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
