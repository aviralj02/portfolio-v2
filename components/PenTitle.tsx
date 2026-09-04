import type { PenTitleData } from "@/lib/pen-title";
import { cn } from "@/lib/utils";

type Props = {
  title: PenTitleData;
  className?: string;
};

/**
 * A word revealed by a pen travelling along the centre of its own strokes, so
 * it appears the way it would be written rather than wiped in from one side.
 *
 * Each stroke is its own element because SVG restarts a dash pattern on every
 * subpath — one path holding them all would draw them simultaneously.
 */
const PenTitle = ({ title, className }: Props): React.JSX.Element => {
  const maskId = `pen-${title.word.toLowerCase()}`;

  return (
    <h1 className="text-primary">
      <span className="sr-only">{title.word}</span>

      <svg
        aria-hidden
        viewBox={title.viewBox}
        className={cn("block h-10 w-auto md:h-14", className)}
      >
        <defs>
          <mask id={maskId}>
            {title.strokes.map((stroke) => (
              <path
                key={stroke.d}
                className="pen-write"
                d={stroke.d}
                fill="none"
                stroke="#fff"
                strokeWidth={title.penWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                style={{
                  animationDelay: `${title.delayMs + stroke.start * title.writeMs}ms`,
                  animationDuration: `${stroke.span * title.writeMs}ms`,
                }}
              />
            ))}
          </mask>
        </defs>

        <path d={title.letters} fill="currentColor" mask={`url(#${maskId})`} />
      </svg>
    </h1>
  );
};

export default PenTitle;
