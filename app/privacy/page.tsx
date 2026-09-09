import type { Metadata } from "next";

import ContentPage from "@/components/content/ContentPage";
import { privacyPage } from "@/lib/agents/site-content";
import { PORTFOLIO_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy | Aviral",
  description: privacyPage.summary,
  alternates: {
    canonical: `${PORTFOLIO_URL}/privacy`,
    types: { "text/markdown": `${PORTFOLIO_URL}/privacy.md` },
  },
};

const Privacy = (): React.JSX.Element => <ContentPage page={privacyPage} />;

export default Privacy;
