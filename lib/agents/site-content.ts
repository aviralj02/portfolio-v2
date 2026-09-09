import { CITY, PORTFOLIO_URL, STATE } from "@/lib/constants";

/**
 * The prose for the pages that exist to be read rather than looked at —
 * About, Contact, Privacy. It is held as data instead of JSX because two
 * renderers consume it: `ContentPage` draws the HTML a person sees, and
 * `lib/agents/markdown.ts` emits the Markdown an agent asks for. One source
 * means the two can never drift apart.
 */

export type ContentBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "links"; items: ContentLink[] };

export type ContentLink = {
  label: string;
  href: string;
  note?: string;
  external?: boolean;
};

export type ContentSection = {
  heading: string;
  blocks: ContentBlock[];
};

export type SitePage = {
  path: string;
  /** Small caps line above the title, matching the other pages. */
  eyebrow: string;
  title: string;
  /** One-sentence lede, reused as the page description and the summary. */
  summary: string;
  sections: ContentSection[];
  /** ISO date, shown as the last review of the page's claims. */
  updated?: string;
};

const GITHUB_URL = "https://github.com/aviralj02";
const LINKEDIN_URL = "https://linkedin.com/in/aviraljain02";

export const aboutPage: SitePage = {
  path: "/about",
  eyebrow: "About",
  title: "About",
  summary: `I'm Aviral Jain, a full stack engineer based in ${CITY}, ${STATE}, India. I build web products end to end — the data model and API underneath, and the interface people actually touch.`,
  sections: [
    {
      heading: "Who I am",
      blocks: [
        {
          kind: "paragraph",
          text: "Full stack is less a title here than a working preference. I would rather own a feature from the schema to the last pixel than hand it across a boundary and hope the two halves meet in the middle. Most of what I ship is TypeScript — React and Next.js at the front, Node and GraphQL behind it — with the interface treated as part of the engineering rather than a coat of paint applied at the end.",
        },
        {
          kind: "paragraph",
          text: "The result is fewer handoffs and fewer gaps: the person who chose the shape of the response is the same person who has to render it, so the awkward cases get designed away instead of argued about.",
        },
      ],
    },
    {
      heading: "How I work",
      blocks: [
        {
          kind: "list",
          items: [
            "Start from the data. Most interface problems are a schema that was decided in a hurry.",
            "Ship the smallest thing that is genuinely finished, then keep it working. Half-built features are debt with a nicer name.",
            "Read the platform before reaching for a library. A lot of what gets installed is already in the browser.",
            "Show the work. Every experiment on the craft pages ships its own source, so you can read what actually runs rather than a description of it.",
          ],
        },
      ],
    },
    {
      heading: "What's on this site",
      blocks: [
        {
          kind: "links",
          items: [
            {
              label: "Work",
              href: "/work",
              note: "Roles I've held, on a timeline, and the projects I've shipped with their stacks and source.",
            },
            {
              label: "Craft",
              href: "/craft",
              note: "UI experiments, animations and interaction studies — each with a preview, a write-up, and its code.",
            },
            {
              label: "Blogs",
              href: "/blogs",
              note: "Writing on tooling, the web platform, and the parts of shipping software that don't fit in a commit message.",
            },
            {
              label: "Contact",
              href: "/contact",
              note: "How to reach me, and what to put in the first message.",
            },
          ],
        },
      ],
    },
    {
      heading: "Elsewhere",
      blocks: [
        {
          kind: "links",
          items: [
            {
              label: "GitHub",
              href: GITHUB_URL,
              note: "Source for this site and most of the projects listed on it.",
              external: true,
            },
            {
              label: "LinkedIn",
              href: LINKEDIN_URL,
              note: "Roles and dates, for anyone who needs the formal version.",
              external: true,
            },
          ],
        },
      ],
    },
  ],
  updated: "2026-09-10",
};

export const contactPage: SitePage = {
  path: "/contact",
  eyebrow: "Contact",
  title: "Contact",
  summary:
    "The fastest way to reach me is the form on the home page — it goes straight to my inbox. Here is what to put in it, and what I'm a good fit for.",
  sections: [
    {
      heading: "Send a message",
      blocks: [
        {
          kind: "paragraph",
          text: "The contact form sits at the bottom of the home page. It takes a name, an email address to reply to, and the message itself, and it delivers all three to my inbox. Nothing else is attached to it.",
        },
        {
          kind: "links",
          items: [
            {
              label: "Contact form",
              href: "/#contact",
              note: "Name, email, message — on the home page.",
            },
            {
              label: "LinkedIn",
              href: LINKEDIN_URL,
              note: "Fine for recruiting and role conversations.",
              external: true,
            },
            {
              label: "GitHub",
              href: GITHUB_URL,
              note: "Open an issue if it's about code I've published.",
              external: true,
            },
          ],
        },
      ],
    },
    {
      heading: "What to include",
      blocks: [
        {
          kind: "list",
          items: [
            "Who you are and where you're writing from.",
            "What you're building, in a sentence or two — the problem is more useful to me than the feature list.",
            "Rough scope and timing, if there is any.",
            "A link to the product, repository or job description, so I can read before replying.",
          ],
        },
      ],
    },
    {
      heading: "What I'm a good fit for",
      blocks: [
        {
          kind: "list",
          items: [
            "Full stack product work in TypeScript — Next.js and React on the front, Node and GraphQL behind them.",
            "Interface work that has real engineering underneath it: animation, interaction detail, design systems, and the performance budget they have to live inside.",
            "Taking a feature from a rough schema to a shipped, maintained surface without a handoff in the middle.",
            "Questions about anything published here — a craft experiment, a project, or a post.",
          ],
        },
        {
          kind: "paragraph",
          text: "I'm one person rather than a support desk, so a reply can take a few days. If something is genuinely time-sensitive, say so in the first line and I'll treat it that way.",
        },
      ],
    },
  ],
  updated: "2026-09-10",
};

export const privacyPage: SitePage = {
  path: "/privacy",
  eyebrow: "Privacy",
  title: "Privacy",
  summary:
    "This site has no accounts, no ads and no cross-site tracking. Below is everything it does collect, why, and who else sees it.",
  sections: [
    {
      heading: "What this site collects",
      blocks: [
        {
          kind: "list",
          items: [
            "Aggregate page views, through Vercel Analytics. It is cookieless and does not build a profile that follows you to other sites.",
            "An approximate city and country, used by the last-visitor tile and the weather capsule in the navigation.",
            "Whatever you type into the contact form: a name, an email address, and a message.",
          ],
        },
      ],
    },
    {
      heading: "The last-visitor tile",
      blocks: [
        {
          kind: "paragraph",
          text: "The tile on the home page that says where the previous visitor came from works like this. Your browser asks ipwho.is for the city and country attached to your connection. That pair — city and country only, never an IP address, never coordinates — overwrites a single record in the CMS, which is then read by whoever loads the page after you. There is one record, so nothing accumulates: your city replaces the last one and is replaced in turn. Block the request and the tile simply keeps showing the visitor before you.",
        },
        {
          kind: "paragraph",
          text: "The weather capsule in the navigation asks the same service for a rough latitude and longitude, then asks Open-Meteo what the weather is there. Neither value is stored anywhere.",
        },
      ],
    },
    {
      heading: "The contact form",
      blocks: [
        {
          kind: "paragraph",
          text: "The form is delivered by EmailJS, which relays the three fields to my inbox and keeps a short delivery log of its own. I use what you send to reply to you, and for nothing else. It is not added to a mailing list, and it is not shared or sold.",
        },
      ],
    },
    {
      heading: "Cookies and local storage",
      blocks: [
        {
          kind: "paragraph",
          text: "This site sets no cookies. Your light or dark theme choice is kept in your browser's local storage so the page does not flash the wrong theme on the next visit; it never leaves your device. Fonts are served from this domain rather than fetched from Google at page load.",
        },
      ],
    },
    {
      heading: "Who else is involved",
      blocks: [
        {
          kind: "list",
          items: [
            "Vercel — hosting, and the analytics described above. Its edge network sees the requests your browser makes for this site.",
            "Hygraph — the CMS holding the writing, projects and roles. Your browser reads from it directly for the last-visitor tile, and writes the city and country pair described above.",
            "EmailJS — delivery for the contact form.",
            "ipwho.is — the approximate location lookup, called by your browser.",
            "Open-Meteo — the weather reading for that location.",
            "Spotify — the now-playing tile is fetched on the server, so your browser only loads the album artwork from Spotify's image CDN.",
          ],
        },
      ],
    },
    {
      heading: "What this site does not do",
      blocks: [
        {
          kind: "list",
          items: [
            "No accounts, no logins, no passwords.",
            "No advertising, ad networks or retargeting pixels.",
            "No selling or sharing of anything you send.",
            "No mailing list, and no marketing email.",
          ],
        },
      ],
    },
    {
      heading: "Questions and changes",
      blocks: [
        {
          kind: "paragraph",
          text: "If you want the city and country pair removed, or you have a question about any of this, use the contact form and say so — there is one record to clear, and clearing it takes a moment. This page is updated whenever the site starts or stops doing one of the things above.",
        },
        {
          kind: "links",
          items: [
            {
              label: "Contact",
              href: "/contact",
              note: "How to reach me about anything on this page.",
            },
          ],
        },
      ],
    },
  ],
  updated: "2026-09-10",
};

export const CONTENT_PAGES: SitePage[] = [aboutPage, contactPage, privacyPage];

export const contentPageFor = (path: string): SitePage | undefined =>
  CONTENT_PAGES.find((page) => page.path === path);

/** Relative hrefs are absolutised for Markdown; agents may read them detached. */
export const absoluteUrl = (href: string): string =>
  href.startsWith("/") ? `${PORTFOLIO_URL}${href}` : href;
