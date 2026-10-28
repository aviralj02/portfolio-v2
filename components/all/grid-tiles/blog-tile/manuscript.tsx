import Caret from "./caret";
import { LINES, TAGS } from "./constants";

type Props = {
  tags: Array<string>;
};

const SHEET =
  "col-start-1 row-start-1 w-20 h-24 sm:w-24 sm:h-28 rounded-lg bg-card card-glass";

/* A draft page on top of another, with the post's date and read time
   tagged around it. Everything shares one grid cell so it centres on the
   page, and the front page, last in source order, stays on top of the
   sheet behind it. */
const Manuscript = ({ tags }: Props) => (
  <div
    aria-hidden
    className="absolute inset-x-0 top-9 bottom-24 grid place-items-center pointer-events-none"
  >
    <div className="grid place-items-center">
      <div className={SHEET} style={{ translate: "-10px 4px", rotate: "-8deg" }} />

      <div
        className={`${SHEET} flex flex-col gap-1.5 p-2.5 sm:p-3`}
        style={{ rotate: "4deg" }}
      >
        <span className="h-1.5 w-3/4 rounded-full bg-foreground/45" />
        <span className="h-1.5 w-1/2 rounded-full bg-foreground/45 mb-1" />
        {LINES.map((width, i) => (
          <span key={i} className="flex items-center gap-0.5">
            <span
              className="h-1 rounded-full bg-foreground/15"
              style={{ width }}
            />
            {i === LINES.length - 1 && <Caret />}
          </span>
        ))}
      </div>

      {tags.slice(0, TAGS.length).map((tag, i) => (
        <span
          key={tag}
          className="col-start-1 row-start-1 whitespace-nowrap rounded-full bg-card card-glass px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-muted-foreground"
          style={{
            translate: `${TAGS[i].x}px ${TAGS[i].y}px`,
            rotate: `${TAGS[i].rotate}deg`,
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default Manuscript;
