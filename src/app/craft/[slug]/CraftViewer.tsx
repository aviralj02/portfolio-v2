"use client";

import { useCallback, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";

import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import remarkGfm from "remark-gfm";

import { markdownComponents } from "@/lib/markdown-components";
import { cn } from "@/lib/utils";

import Toolbar from "./Toolbar";

type Props = {
  slug: string;
  codeHtml: string;
  sourceCode: string;
  writeupMarkdown?: string;
};

const craftComponents = {
  "spring-counter": dynamic(
    () => import("@/components/crafts/spring-counter"),
    { ssr: false }
  ),
} as const;

export default function CraftViewer({
  slug,
  codeHtml,
  sourceCode,
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
    [slug]
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
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 min-h-[320px] sm:min-h-[400px] flex flex-col items-center justify-center gap-8 overflow-hidden">
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
            <motion.button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy source code"}
              whileTap={{ scale: 0.88 }}
              className={cn(
                "absolute top-3 right-3 z-10 cursor-pointer flex size-8 items-center justify-center rounded-lg border border-border bg-card/90 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:text-primary",
                copied && "text-primary"
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

            <div
              className="[&_pre]:m-0 [&_pre]:p-4 sm:[&_pre]:p-6 [&_pre]:whitespace-pre-wrap [&_pre]:break-all [&_pre]:bg-transparent! [&_pre]:overflow-x-auto [&_pre]:scrollbar"
              dangerouslySetInnerHTML={{ __html: codeHtml }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
