const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type BlogEntry = Blog & {
  year: number;
  day: string;
  month: string;
  fullDate: string;
  summary: string;
  startsYear: boolean;
};

/**
 * Reads the calendar parts straight off the ISO string instead of going through
 * `Date`, so the server and the client never disagree about the timezone.
 */
const readDate = (value: string) => {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);

  return { year, month, day };
};

const summarize = (text: string, limit = 190): string => {
  const clean = text.trim().replace(/\s+/g, " ");

  if (clean.length <= limit) return clean;

  const cut = clean.slice(0, limit);
  const boundary = cut.lastIndexOf(" ");

  return `${boundary > 0 ? cut.slice(0, boundary) : cut}…`;
};

/** Blogs arrive newest-first, so a year changes at most once per entry. */
export const buildEntries = (blogs: Blog[]): BlogEntry[] => {
  let previousYear: number | null = null;

  return blogs.map((blog) => {
    const { year, month, day } = readDate(blog.publishDate);
    const startsYear = year !== previousYear;
    previousYear = year;

    return {
      ...blog,
      year,
      day: String(day).padStart(2, "0"),
      month: MONTHS[month - 1],
      fullDate: `${MONTHS[month - 1]} ${day}, ${year}`,
      summary: summarize(blog.description),
      startsYear,
    };
  });
};

/** The span the archive covers, for the masthead summary. */
export const archiveSpan = (blogs: Blog[]): string | null => {
  if (blogs.length === 0) return null;

  const years = blogs.map((blog) => readDate(blog.publishDate).year);
  const from = Math.min(...years);
  const to = Math.max(...years);

  return from === to ? `${from}` : `${from}–${to}`;
};
