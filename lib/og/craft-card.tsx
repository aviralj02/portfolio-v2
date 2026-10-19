import type { ReactNode } from "react";
import { ImageResponse } from "next/og";

import fs from "node:fs/promises";
import path from "node:path";

/**
 * The social card for a craft: the craft open in an editor, imported and
 * rendered as a JSX tag with its description as the comment underneath, over
 * the same night sky as the site-wide cards. Satori can't blur or render SVG
 * noise, so the sky is a pre-rendered image and only the code is drawn here.
 */

export const OG_SIZE = { width: 1200, height: 630 };

const ASSETS = path.join(process.cwd(), "assets/og");

const GUTTER = 100;
const LINE_NUMBER_WIDTH = 40;

const TAG_MAX_SIZE = 76;
const TAG_MAX_WIDTH = 940;
/* Geist Mono advances 0.6em per glyph; the -0.06em tracking takes it to 0.54. */
const GLYPH_WIDTH = 0.54;

/* Monospace, so a character count is a width; 55 keeps the comment block
   narrower than the tag above it, and every current description to 3 lines. */
const COMMENT_LINE_LENGTH = 55;
const COMMENT_MAX_LINES = 3;

const COLORS = {
  text: "#fafafa",
  muted: "#a1a1aa",
  punctuation: "#52525b",
  comment: "#8b8b94",
  keyword: "#c084fc",
  string: "#86efac",
};

/** "OTP Input" -> "OTPInput", "Wobble Tabs" -> "WobbleTabs". */
const toComponentName = (title: string) =>
  title
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

const wrapComment = (text: string): Array<string> => {
  const lines: Array<string> = [];
  let line = "";

  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;

    if (next.length > COMMENT_LINE_LENGTH && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);

  if (lines.length > COMMENT_MAX_LINES) {
    const kept = lines.slice(0, COMMENT_MAX_LINES);
    kept[COMMENT_MAX_LINES - 1] = `${kept[COMMENT_MAX_LINES - 1].replace(/[\s,.-]+$/, "")}…`;
    return kept;
  }

  return lines;
};

const loadAssets = async () => {
  const [background, mono400, mono500, mono600] = await Promise.all([
    fs.readFile(path.join(ASSETS, "background.jpg")),
    fs.readFile(path.join(ASSETS, "fonts/GeistMono-Regular.ttf")),
    fs.readFile(path.join(ASSETS, "fonts/GeistMono-Medium.ttf")),
    fs.readFile(path.join(ASSETS, "fonts/GeistMono-SemiBold.ttf")),
  ]);

  return {
    background: `data:image/jpeg;base64,${background.toString("base64")}`,
    fonts: [
      { name: "Geist Mono", data: mono400, weight: 400 as const },
      { name: "Geist Mono", data: mono500, weight: 500 as const },
      { name: "Geist Mono", data: mono600, weight: 600 as const },
    ],
  };
};

const LineNumber = ({ n, active }: { n: number; active?: boolean }) => (
  <span
    style={{
      width: LINE_NUMBER_WIDTH,
      flexShrink: 0,
      fontSize: 15,
      color: active ? "#d4d4d8" : COLORS.punctuation,
    }}
  >
    {n}
  </span>
);

const CodeLine = ({
  n,
  color = COLORS.muted,
  children,
}: {
  n: number;
  color?: string;
  children?: ReactNode;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      height: 30,
      fontSize: 19,
      color,
    }}
  >
    <LineNumber n={n} />
    {children}
  </div>
);

type CraftCardProps = {
  slug: string;
  title: string;
  description: string;
};

export const renderCraftCard = async ({
  slug,
  title,
  description,
}: CraftCardProps): Promise<ImageResponse> => {
  const { background, fonts } = await loadAssets();

  const name = toComponentName(title);
  const comment = wrapComment(description);
  /* `<`, ` `, `/`, `>` around the name, the space drawn narrower than a glyph. */
  const tagSize = Math.min(
    TAG_MAX_SIZE,
    Math.floor(TAG_MAX_WIDTH / ((name.length + 3.5) * GLYPH_WIDTH)),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: `86px ${GUTTER}px 0`,
          backgroundColor: "#0b0b0d",
          color: COLORS.text,
          fontFamily: "Geist Mono",
        }}
      >
        <img
          alt=""
          src={background}
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          style={{ position: "absolute", top: 0, left: 0 }}
        />

        {/* editor tab */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            alignSelf: "flex-start",
            gap: 10,
            padding: "8px 12px 8px 10px",
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: 8,
            backgroundColor: "rgba(255,255,255,.05)",
            fontSize: 15,
            color: "#e4e4e7",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 16,
              height: 16,
              borderRadius: 4,
              backgroundColor: "#2563eb",
              color: "#fff",
              fontSize: 9,
              fontWeight: 600,
            }}
          >
            TS
          </div>
          {slug}.tsx
          <span style={{ marginLeft: 6, color: "#71717a" }}>×</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 54 }}>
          <CodeLine n={1}>
            <span style={{ color: COLORS.keyword }}>import</span>
            <span style={{ color: COLORS.punctuation, margin: "0 11px" }}>{"{"}</span>
            <span>{name}</span>
            <span style={{ color: COLORS.punctuation, margin: "0 11px" }}>{"}"}</span>
            <span style={{ color: COLORS.keyword }}>from</span>
            <span style={{ color: COLORS.string, marginLeft: 11 }}>
              &quot;@/crafts&quot;
            </span>
          </CodeLine>
          <CodeLine n={2} />

          {/* the active line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              padding: "20px 0 23px",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -GUTTER,
                top: 8,
                bottom: 12,
                width: OG_SIZE.width,
                borderTop: "1px solid rgba(255,255,255,.06)",
                borderBottom: "1px solid rgba(255,255,255,.06)",
                backgroundImage:
                  "linear-gradient(90deg, rgba(255,255,255,.055), rgba(255,255,255,.035) 60%, rgba(255,255,255,0))",
              }}
            />
            <LineNumber n={3} active />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: tagSize,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: tagSize * -0.06,
              }}
            >
              <span style={{ color: COLORS.punctuation, fontWeight: 400 }}>
                {"<"}
              </span>
              <span>{name}</span>
              <span
                style={{
                  color: COLORS.punctuation,
                  fontWeight: 400,
                  marginLeft: tagSize * 0.24,
                }}
              >
                {"/>"}
              </span>
              <div
                style={{
                  width: 4,
                  height: tagSize * 0.84,
                  marginLeft: 10,
                  backgroundColor: COLORS.text,
                }}
              />
            </div>
          </div>

          <CodeLine n={4} />
          {comment.map((line, i) => (
            <CodeLine key={i} n={5 + i} color={COLORS.comment}>
              {`// ${line}`}
            </CodeLine>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: GUTTER,
            bottom: 62,
            fontSize: 18,
            color: COLORS.muted,
          }}
        >
          heyaviral.com
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
};
