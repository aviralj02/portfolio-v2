import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeft } from "lucide-react";
import fs from "node:fs/promises";
import path from "node:path";
import { codeToHtml } from "shiki";

import PageWrapper from "@/components/PageWrapper";

import { crafts, getCraft } from "../_registry";

import CraftViewer from "./CraftViewer";

export const dynamicParams = false;

export async function generateStaticParams() {
  return crafts.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const craft = getCraft(slug);
  if (!craft) return {};
  return {
    title: `${craft.title} | Crafts`,
    description: craft.description,
  };
}

export default async function CraftDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const craft = getCraft(slug);

  if (!craft) notFound();

  const source = await fs.readFile(
    path.join(process.cwd(), craft.sourcePath),
    "utf8"
  );
  const writeupMarkdown = craft.writeupPath
    ? await fs.readFile(path.join(process.cwd(), craft.writeupPath), "utf8")
    : "";

  const codeHtml = await codeToHtml(source, {
    lang: "tsx",
    themes: { light: "light-plus", dark: "dark-plus" },
  });

  return (
    <PageWrapper className="flex flex-col gap-6 sm:my-6 my-12">
      <div className="flex flex-col items-start text-primary gap-2">
        <Link
          href="/craft"
          aria-label="Back to Crafts"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Crafts
        </Link>

        <h1 className="sm:text-2xl text-xl font-semibold">{craft.title}</h1>
        <p className="sm:text-base text-sm text-muted-foreground">
          {craft.description}
        </p>
      </div>

      <CraftViewer
        slug={craft.slug}
        codeHtml={codeHtml}
        sourceCode={source}
        writeupMarkdown={writeupMarkdown}
      />
    </PageWrapper>
  );
}
