"use client";

import { useCallback, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";

import { Check, Copy, ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import remarkGfm from "remark-gfm";

import { markdownComponents } from "@/lib/markdown-components";
import { cn } from "@/lib/utils";

import Toolbar from "./Toolbar";

type Props = {
  slug: string;
  codeHtml: string;
  sourceCode: string;
  sourceName: string;
  sourceLinks?: Array<{ path: string; url: string }>;
  writeupMarkdown?: string;
};

const craftComponents = {
  "spring-counter": dynamic(
    () => import("@/components/crafts/spring-counter"),
    { ssr: false },
  ),
  "morph-menu": dynamic(() => import("@/components/crafts/morph-menu"), {
    ssr: false,
  }),
  "draggable-list": dynamic(
    () => import("@/components/crafts/draggable-list"),
    { ssr: false },
  ),
} as const;

export default function CraftViewer({
  slug,
  codeHtml,
  sourceCode,
  sourceName,
  sourceLinks = [],
  writeupMarkdown,
}: Props) {
  const [tab, setTab] = useState<"preview" | "source">("preview");
  const [resetKey, setResetKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(sourceCode).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, [sourceCode]);

  const Component = useMemo(
    () => craftComponents[slug as keyof typeof craftComponents] ?? null,
    [slug],
  );

  return (
    <div className="flex flex-col gap-3">
      <Toolbar
        tab={tab}
        onTabChange={setTab}
        onReset={() => setResetKey((k) => k + 1)}
        showReset={tab === "preview"}
      />

      <AnimatePresence mode="wait" initial={false}>
        {tab === "preview" ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.1, ease: "linear" }}
            className="flex flex-col gap-8 w-full"
          >
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 min-h-80 sm:min-h-100 flex flex-col items-center justify-center gap-8 overflow-hidden">
              {Component ? <Component key={resetKey} /> : null}
            </div>

            {writeupMarkdown ? (
              <section className="w-full pt-2 border-t border-border/60">
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <ReactMarkdown
                    components={markdownComponents}
                    remarkPlugins={[remarkGfm]}
                  >
                    {writeupMarkdown}
                  </ReactMarkdown>
                </div>
              </section>
            ) : null}
          </motion.div>
        ) : (
          <motion.div
            key="source"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.1, ease: "linear" }}
            className="relative w-full rounded-2xl border border-border bg-card overflow-hidden text-sm"
          >
            <div className="no-scrollbar flex items-stretch overflow-x-auto max-w-[85vw] border-b border-border pr-10">
              <div className="relative inline-flex shrink-0 select-none items-center px-4 py-2.5 font-mono text-[11px] font-medium text-foreground">
                {sourceName}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground" />
              </div>

              {/* Other files — GitHub links */}
              {sourceLinks.map((file) => (
                <a
                  key={file.path}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex shrink-0 items-center gap-1 px-4 py-2.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                >
                  {file.path.split("/").at(-1)}
                  <ExternalLink className="size-2.5 opacity-0 transition-opacity group-hover:opacity-50" />
                </a>
              ))}
            </div>

            <motion.button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy source code"}
              whileTap={{ scale: 0.88 }}
              className={cn(
                "absolute top-12 right-3 z-10 cursor-pointer flex size-8 items-center justify-center rounded-lg border border-border bg-card/90 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:text-primary",
                copied && "text-primary",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Check
                      className="size-3.5 text-emerald-500"
                      strokeWidth={2.5}
                    />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Copy className="size-3.5" strokeWidth={2} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="max-w-[85vw] overflow-x-auto">
              <div
                className="[&_pre]:m-0 [&_pre]:p-4 sm:[&_pre]:p-6 [&_pre]:whitespace-pre [&_pre]:break-all [&_pre]:bg-transparent! [&_pre]:overflow-x-auto [&_pre]:scrollbar"
                dangerouslySetInnerHTML={{ __html: codeHtml }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
