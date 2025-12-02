import Image from "next/image";
import { formatDateToMonthYear } from "@/lib/utils";

type Props = {
  data: Array<Experience> | undefined;
};

const ExperienceList = ({ data }: Props) => {
  return (
    <div className="flex flex-col divide-y divide-border/60 w-full">
      {data?.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 py-4 transition-all duration-200 hover:bg-accent/20 rounded-sm pr-4 pl-2"
        >
          <div className="min-w-[36px] min-h-[36px] relative">
            <Image
              src={item.logo.url}
              alt={item.companyName}
              width={36}
              height={36}
              className="rounded-md object-cover opacity-90"
            />
          </div>

          <div className="flex sm:flex-row flex-col gap-1 w-full items-start justify-between">
            <div className="flex flex-col">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-primary font-medium sm:text-base text-sm hover:underline underline-offset-2"
              >
                {item.companyName}
              </a>

              <p className="text-muted-foreground sm:text-sm text-xs">
                {item.role}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-dim whitespace-nowrap">
              {formatDateToMonthYear(new Date(item.startDate))} -{" "}
              {item.currentlyWorking
                ? "Present"
                : formatDateToMonthYear(new Date(item.endDate))}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceList;
