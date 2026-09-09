import type { Metadata } from "next";

import ContentPage from "@/components/content/ContentPage";
import { aboutPage } from "@/lib/agents/site-content";
import { PORTFOLIO_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About | Aviral",
  description: aboutPage.summary,
  alternates: {
    canonical: `${PORTFOLIO_URL}/about`,
    types: { "text/markdown": `${PORTFOLIO_URL}/about.md` },
  },
};

const About = (): React.JSX.Element => <ContentPage page={aboutPage} />;

export default About;
