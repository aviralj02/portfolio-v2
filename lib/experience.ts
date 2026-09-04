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

export type ExperienceEntry = {
  company: string;
  role: string;
  url: string;
  logo: Asset;
  current: boolean;
  /** "Jun 2024 — Sep 2024" */
  range: string;
  /** "3 mos", "1 yr 2 mos" */
  duration: string;
  /** Position and size on the axis, both 0–1. */
  offset: number;
  width: number;
};

export type Timeline = {
  entries: ExperienceEntry[];
  /** Axis end labels, e.g. "Jun 2024" and "Now". */
  from: string;
  to: string;
  /** Labelled marks every three months, as 0–1 positions along the axis. */
  ticks: { at: number; label: string }[];
  /** Every month boundary, for the ruler's minor marks. */
  marks: number[];
  /** Total span in months — the scrollable scale is sized from this. */
  months: number;
};

/**
 * Months since epoch, read straight off the ISO string rather than through
 * `Date`, so the server and the client never disagree about the timezone.
 *
 * Snapped to the middle of the month rather than the exact day. Roles that
 * hand over inside one month — one ending 1 July, the next starting the 28th —
 * would otherwise be drawn with most of a month of daylight between them, and
 * read as a career break that never happened. On midpoints they meet exactly,
 * while a genuine gap of whole months survives at full size. It also makes a
 * bar's length agree with the "N mos" printed on it.
 */
const toMonths = (value: string): number => {
  const [year, month] = value.slice(0, 10).split("-").map(Number);

  return year * 12 + (month - 1) + 0.5;
};

const label = (value: string): string => {
  const [year, month] = value.slice(0, 10).split("-").map(Number);

  return `${MONTHS[month - 1]} ${year}`;
};

/** Whole months between two dates, so "Jul 2025 — Dec 2025" doesn't read "4 mos". */
const monthsBetween = (from: string, to: string): number => {
  const [fy, fm] = from.slice(0, 10).split("-").map(Number);
  const [ty, tm] = to.slice(0, 10).split("-").map(Number);

  return Math.max(1, ty * 12 + tm - (fy * 12 + fm));
};

const spell = (months: number): string => {
  const total = Math.max(1, Math.round(months));
  const years = Math.floor(total / 12);
  const rest = total % 12;
  const parts = [];

  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (rest || !years) parts.push(`${rest || 1} mo${rest > 1 ? "s" : ""}`);

  return parts.join(" ");
};

/**
 * Lays the roles out on a shared, true-to-scale time axis: `offset` and `width`
 * are fractions of the whole career span, so the gaps between roles are as real
 * as the roles themselves.
 *
 * `asOf` is passed in rather than read from `Date.now()` here — the page is
 * prerendered, and a "now" computed at render time would differ between the
 * server's HTML and the client's hydration.
 */
export const buildTimeline = (
  data: Experience[] | undefined,
  asOf: string,
): Timeline | null => {
  if (!data?.length) return null;

  const roles = data.map((item) => {
    const startISO = String(item.startDate).slice(0, 10);
    const endISO = item.currentlyWorking
      ? asOf
      : String(item.endDate).slice(0, 10);

    return { item, startISO, endISO, start: toMonths(startISO), end: toMonths(endISO) };
  });

  const first = Math.min(...roles.map((r) => r.start));
  const last = Math.max(...roles.map((r) => r.end));
  const span = last - first || 1;

  const entries = roles.map(({ item, startISO, endISO, start, end }) => ({
    company: item.companyName,
    role: item.role,
    url: item.url,
    logo: item.logo,
    current: item.currentlyWorking,
    range: `${label(startISO)} - ${item.currentlyWorking ? "Present" : label(endISO)}`,
    duration: spell(monthsBetween(startISO, endISO)),
    offset: (start - first) / span,
    width: (end - start) / span,
  }));

  /* A ruler rather than a bare line: a minor mark every month, a labelled one
     every quarter. The year is printed only when it changes, so the strip
     reads "Jun 2024 · Sep · Dec · Mar 2025" instead of repeating itself. */
  /* Anchored on the rounded start month, and begun at the first boundary that
     actually falls inside the span — the axis starts mid-month, so counting
     from `floor` puts the opening tick at a negative position. The span's own
     ends are labelled separately, as bookends. */
  const anchor = Math.round(first);
  const marks: number[] = [];
  const ticks: { at: number; label: string }[] = [];
  let printedYear = 0;

  for (let m = Math.ceil(first); m <= Math.floor(last); m++) {
    const at = (m - first) / span;

    marks.push(at);

    if ((m - anchor) % 3 !== 0) continue;

    const year = Math.floor(m / 12);
    const month = m % 12;
    ticks.push({
      at,
      label:
        year === printedYear
          ? MONTHS[month]
          : `${MONTHS[month]} ${(printedYear = year)}`,
    });
  }

  return {
    entries,
    marks,
    months: span,
    from: label(roles.reduce((a, b) => (a.start < b.start ? a : b)).startISO),
    to: entries.some((entry) => entry.current) ? "Now" : label(
      roles.reduce((a, b) => (a.end > b.end ? a : b)).endISO,
    ),
    ticks,
  };
};
