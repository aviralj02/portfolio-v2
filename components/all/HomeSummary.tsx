import { Link } from "next-view-transitions";

/**
 * A written summary of a page that is otherwise a grid of tiles.
 *
 * Nine boxes of live data read well by eye and badly in a linear pass, which
 * is what a screen reader and an agent both make. This says the same things in
 * prose and gives every destination a name, so the home page is legible
 * without sight and without JavaScript. It carries no styling of its own:
 * `sr-only` keeps it out of the visual layout entirely.
 */

const DESTINATIONS = [
  {
    href: "/work",
    label: "Work",
    note: "Roles on a timeline, and the projects behind them, with their stacks and source links.",
  },
  {
    href: "/craft",
    label: "Craft",
    note: "UI experiments, animations and interaction studies. Each one has a live preview, a write-up, and its full source.",
  },
  {
    href: "/blogs",
    label: "Blogs",
    note: "Writing on tooling, the web platform, and the parts of shipping software that don't fit in a commit message.",
  },
  {
    href: "/about",
    label: "About",
    note: "Background, how I work, and what lives where on this site.",
  },
  {
    href: "/contact",
    label: "Contact",
    note: "How to get in touch, and what to put in the first message.",
  },
  {
    href: "/privacy",
    label: "Privacy",
    note: "What this site collects, why, and who else sees it.",
  },
];

const HomeSummary = (): React.JSX.Element => {
  return (
    <section aria-labelledby="site-summary" className="sr-only">
      <h2 id="site-summary">About this site</h2>

      <p>
        Aviral Jain is a full stack engineer based in Bengaluru, Karnataka,
        India, building web products end to end — the data model and API
        underneath, and the interface people actually touch. Most of that work
        is TypeScript: React and Next.js at the front, Node and GraphQL behind
        them, with the interface treated as part of the engineering rather than
        a coat of paint applied at the end.
      </p>

      <p>
        This page is a grid of tiles. It holds an introduction, the most recent
        blog post, the most recent project, links to GitHub, LinkedIn, X and
        Medium, whatever is playing on Spotify at the moment, the local time in
        Bengaluru, the city the previous visitor arrived from, a light and dark
        theme switch, and a contact form that reaches Aviral&apos;s inbox.
      </p>

      <h3>Where things are</h3>

      <ul>
        {DESTINATIONS.map((destination) => (
          <li key={destination.href}>
            <Link href={destination.href}>{destination.label}</Link> —{" "}
            {destination.note}
          </li>
        ))}
      </ul>

      <h3>For agents</h3>

      <p>
        Every page here is also served as Markdown from the same URL: send an{" "}
        <code>Accept: text/markdown</code> request header, or append{" "}
        <code>.md</code> to the path. A short overview of the whole site,
        including when it is worth reading, is at <a href="/llms.txt">llms.txt</a>,
        and the full list of URLs is at <a href="/sitemap.xml">sitemap.xml</a>.
      </p>
    </section>
  );
};

export default HomeSummary;
