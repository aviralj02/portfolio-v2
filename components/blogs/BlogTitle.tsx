import {
  LETTERS_PATH,
  PEN_STROKES,
  PEN_WIDTH,
  TITLE_VIEW_BOX,
  WRITE_DELAY_MS,
  WRITE_MS,
} from "./blogs-title-paths";

const BlogTitle = (): React.JSX.Element => {
  return (
    <h1 className="text-primary">
      <span className="sr-only">Blogs</span>

      <svg aria-hidden viewBox={TITLE_VIEW_BOX} className="block h-10 md:h-14 w-auto">
        <defs>
          <mask id="blogs-pen">
            {PEN_STROKES.map((stroke) => (
              <path
                key={stroke.d}
                className="blogs-pen"
                d={stroke.d}
                fill="none"
                stroke="#fff"
                strokeWidth={PEN_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                style={{
                  animationDelay: `${WRITE_DELAY_MS + stroke.start * WRITE_MS}ms`,
                  animationDuration: `${stroke.span * WRITE_MS}ms`,
                }}
              />
            ))}
          </mask>
        </defs>

        <path d={LETTERS_PATH} fill="currentColor" mask="url(#blogs-pen)" />
      </svg>
    </h1>
  );
};

export default BlogTitle;
