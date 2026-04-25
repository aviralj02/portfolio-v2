"use client";

import { useState } from "react";

import { MessageSquareDot } from "lucide-react";
import MorphMenu, { MorphMenuContent, MorphMenuTrigger } from "./popover";

const MESSAGES = [
  {
    initials: "AK",
    name: "Alex K.",
    preview: "Hey, are you free later?",
    time: "2m",
    unread: 2,
  },
  {
    initials: "SR",
    name: "Sam R.",
    preview: "Sure, sounds good to me.",
    time: "15m",
    unread: 0,
  },
  {
    initials: "KL",
    name: "Kim L.",
    preview: "On my way, be there soon!",
    time: "1h",
    unread: 1,
  },
];

export default function BlobMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-end justify-center min-h-[320px] w-full">
      <MorphMenu
        open={open}
        onOpenChangeAction={setOpen}
        cardHeight={240}
        cardWidth={240}
        gap={20}
      >
        <MorphMenuTrigger>
          <button
            className="size-14 rounded-full bg-foreground flex items-center justify-center cursor-pointer relative z-10"
            aria-label={open ? "Close messages" : "Open messages"}
          >
            <MessageSquareDot
              className="size-5 text-background"
              strokeWidth={2}
            />
          </button>
        </MorphMenuTrigger>

        <MorphMenuContent className="flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between p-2">
            <span className="text-[11px] font-semibold text-background/60 uppercase tracking-wider">
              Messages
            </span>
            <span className="text-[10px] font-bold bg-background/15 text-background rounded-full px-2 py-0.5 leading-none">
              {MESSAGES.length}
            </span>
          </div>

          <div className="h-px bg-background/10 mx-4" />

          {MESSAGES.map((msg, i) => (
            <div key={msg.name}>
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-background/10 rounded-2xl cursor-pointer">
                <div className="size-8 rounded-full bg-background/12 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-background">
                    {msg.initials}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-background truncate">
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-background/45 shrink-0">
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-background/60 truncate mt-0.5">
                    {msg.preview}
                  </p>
                </div>

                {msg.unread > 0 && (
                  <div className="size-[18px] rounded-full bg-background flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-foreground leading-none">
                      {msg.unread}
                    </span>
                  </div>
                )}
              </div>
              {i < MESSAGES.length - 1 && (
                <div className="h-px bg-background/10 mx-4" />
              )}
            </div>
          ))}
        </MorphMenuContent>
      </MorphMenu>
    </div>
  );
}
