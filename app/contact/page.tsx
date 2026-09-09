import type { Metadata } from "next";

import ContentPage from "@/components/content/ContentPage";
import { contactPage } from "@/lib/agents/site-content";
import { PORTFOLIO_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact | Aviral",
  description: contactPage.summary,
  alternates: {
    canonical: `${PORTFOLIO_URL}/contact`,
    types: { "text/markdown": `${PORTFOLIO_URL}/contact.md` },
  },
};

const Contact = (): React.JSX.Element => <ContentPage page={contactPage} />;

export default Contact;
