"use client";

import { useState } from "react";

import { ArrowUp, Blocks, Mic, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

import Liquid, { LiquidAttachment } from "./liquid";

const GAP = { min: -40, max: 48, initial: 8 };

const iconButton =
  "flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/8 hover:text-primary cursor-pointer";

export default function LiquidInput() {
  const [open, setOpen] = useState(true);
  const [gap, setGap] = useState(GAP.initial);
  const [debug, setDebug] = useState(false);
  const [message, setMessage] = useState("");

  const canSend = message.trim().length > 0;

  return (
    <div className="flex w-full grow max-w-lg flex-col justify-end gap-8 rounded-[28px] border border-border/60 bg-background px-5 pt-24 pb-5 sm:px-16 sm:pt-28 sm:pb-6">
      <Liquid
        gap={gap}
        radius={22}
        debug={debug}
        className="[--liquid-fill:#fff] dark:[--liquid-fill:#000] dark:[--liquid-ring:rgba(255,255,255,0.18)] dark:[--liquid-shadow:rgba(0,0,0,0.7)]"
      >
        <LiquidAttachment
          show={open}
          className="flex items-center gap-3 px-3 py-2.5"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Blocks className="size-4" strokeWidth={2} />
          </span>

          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Connector
            </p>
            <p className="truncate text-sm font-semibold text-primary">
              Notion
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="cursor-pointer rounded-full px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="cursor-pointer rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/85"
          >
            Connect
          </button>
        </LiquidAttachment>

        <div className="flex flex-col gap-3 p-4">
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything..."
            className="w-full resize-none bg-transparent text-sm text-primary outline-none placeholder:text-muted-foreground"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Attach"
                onClick={() => setOpen(true)}
                className={iconButton}
              >
                <Plus className="size-4" strokeWidth={2} />
              </button>
              <button type="button" aria-label="Voice" className={iconButton}>
                <Mic className="size-4" strokeWidth={2} />
              </button>
            </div>

            <button
              type="button"
              aria-label="Send"
              disabled={!canSend}
              onClick={() => setMessage("")}
              className={cn(
                "flex size-8 items-center justify-center rounded-full transition-colors",
                canSend
                  ? "cursor-pointer bg-primary text-primary-foreground hover:bg-primary/85"
                  : "bg-foreground/8 text-muted-foreground/60",
              )}
            >
              <ArrowUp className="size-4" strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </Liquid>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-muted-foreground">
        <label className="flex items-center gap-2.5">
          Gap
          <input
            type="range"
            min={GAP.min}
            max={GAP.max}
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            className="w-28 cursor-pointer accent-primary"
          />
          <span className="w-10 tabular-nums text-primary">{gap}px</span>
        </label>

        <label className="flex cursor-pointer items-center gap-1.5">
          <input
            type="checkbox"
            checked={debug}
            onChange={(e) => setDebug(e.target.checked)}
            className="accent-primary"
          />
          Debug
        </label>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-pressed={open}
          className="cursor-pointer rounded-full bg-foreground/10 px-3 py-1 text-[11px] font-medium text-foreground/70 transition-colors hover:bg-foreground/15 hover:text-foreground"
        >
          Toggle
        </button>
      </div>
    </div>
  );
}
