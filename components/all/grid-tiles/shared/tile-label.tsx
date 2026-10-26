import { ArrowUpRight } from "lucide-react";

type Props = {
  title: string;
  description?: string;
};

/* Two arrows share one cell: on hover the first flies out top-right while
   the second slides in from bottom-left, a small "this goes somewhere" cue. */
const ARROW =
  "col-start-1 row-start-1 w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

const TileLabel = ({ title, description }: Props) => (
  <div className="absolute left-3 right-3 bottom-3 sm:left-5 sm:right-5 sm:bottom-4 flex flex-col gap-1 pointer-events-none">
    <div className="flex items-center gap-1">
      <h2 className="text-sm sm:text-base font-semibold tracking-tight text-balance">
        {title}
      </h2>
      <span
        aria-hidden
        className="grid shrink-0 overflow-hidden text-muted-foreground transition-colors duration-300 group-hover:text-foreground"
      >
        <ArrowUpRight
          className={`${ARROW} group-hover:translate-x-full group-hover:-translate-y-full`}
        />
        <ArrowUpRight
          className={`${ARROW} -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0`}
        />
      </span>
    </div>
    {description && (
      <p className="line-clamp-3 text-xs text-muted-foreground leading-snug text-pretty">
        {description}
      </p>
    )}
  </div>
);

export default TileLabel;
