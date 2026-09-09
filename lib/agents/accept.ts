/**
 * Proactive content negotiation between the two representations this site
 * produces: HTML for browsers, Markdown for agents.
 *
 * The matching rules are RFC 9110 §12.5.1 — the most specific media range that
 * matches a candidate decides its weight, regardless of q. That is what stops
 * a trailing wildcard from resurrecting a type the client explicitly refused
 * with `q=0`.
 *
 * Shape follows the published Next.js recipe at
 * https://acceptmarkdown.com/recipes/nextjs.
 */

export const HTML = "text/html";
export const MARKDOWN = "text/markdown";

/**
 * HTML first: a client that will take anything is a browser far more often
 * than it is an agent, and ties are broken by this order.
 */
export const PRODUCES = [HTML, MARKDOWN] as const;

export type Produced = (typeof PRODUCES)[number];

export type AcceptEntry = {
  type: string;
  q: number;
  /** 2 = exact type, 1 = subtype wildcard, 0 = full wildcard. */
  specificity: number;
};

/** Client order is preserved: position is the tiebreak for equal q. */
export const parseAccept = (header: string): AcceptEntry[] =>
  header.split(",").map((raw) => {
    const parts = raw
      .trim()
      .split(";")
      .map((part) => part.trim());
    const type = parts[0].toLowerCase();

    let q = 1;
    for (const param of parts.slice(1)) {
      const [name, value] = param.split("=").map((piece) => piece.trim());

      if (name?.toLowerCase() === "q") {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
      }
    }

    const specificity = type === "*/*" ? 0 : type.endsWith("/*") ? 1 : 2;

    return { type, q, specificity };
  });

const matches = (entry: AcceptEntry, candidate: string): boolean => {
  if (entry.type === "*/*") return true;
  if (entry.type.endsWith("/*"))
    return candidate.startsWith(entry.type.slice(0, -1));

  return entry.type === candidate;
};

/** The most specific range that matches a candidate, and where it sat. */
const bestMatchFor = (
  entries: AcceptEntry[],
  candidate: string,
): { entry: AcceptEntry; position: number } | null => {
  let best: { entry: AcceptEntry; position: number } | null = null;

  for (let index = 0; index < entries.length; index++) {
    const entry = entries[index];
    if (!matches(entry, candidate)) continue;

    if (
      best === null ||
      entry.specificity > best.entry.specificity ||
      (entry.specificity === best.entry.specificity && index < best.position)
    ) {
      best = { entry, position: index };
    }
  }

  return best;
};

/**
 * The representation to serve, or `null` when the client will take neither —
 * the one case that earns a 406.
 */
export const negotiate = (header: string | null | undefined): Produced | null => {
  if (!header) return PRODUCES[0];

  const entries = parseAccept(header);
  if (entries.length === 0) return PRODUCES[0];

  let chosen: Produced | null = null;
  let chosenQ = -1;
  let chosenPosition = Infinity;

  for (const candidate of PRODUCES) {
    const match = bestMatchFor(entries, candidate);
    if (match === null) continue;
    /* q=0 is a refusal, not a low preference. */
    if (match.entry.q <= 0) continue;

    if (
      match.entry.q > chosenQ ||
      (match.entry.q === chosenQ && match.position < chosenPosition)
    ) {
      chosen = candidate;
      chosenQ = match.entry.q;
      chosenPosition = match.position;
    }
  }

  return chosen;
};

/**
 * Whether the client named HTML rather than merely tolerating it. Only the 404
 * path asks: a browser says `text/html` out loud, so anything that did not —
 * curl, a fetch tool, a crawler with no Accept at all — is better served the
 * Markdown recovery page than a rendered one.
 */
export const acceptsHtmlExplicitly = (
  header: string | null | undefined,
): boolean => {
  if (!header) return false;

  return parseAccept(header).some(
    (entry) => entry.q > 0 && (entry.type === HTML || entry.type === "text/*"),
  );
};

/**
 * Adds `Accept` to a `Vary` header without disturbing what is already there —
 * Next puts its router tokens in that header, and dropping them would break
 * client-side navigation caching.
 */
export const appendVaryAccept = (headers: Headers): void => {
  const existing = headers.get("Vary");

  if (!existing) {
    headers.set("Vary", "Accept");
    return;
  }

  const tokens = existing.split(",").map((token) => token.trim().toLowerCase());
  if (tokens.includes("accept") || tokens.includes("*")) return;

  headers.set("Vary", `${existing}, Accept`);
};
