"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import emailjs from "@emailjs/browser";
import { ArrowUp, Check, Loader } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { z } from "zod";

import { cn } from "@/lib/utils";

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string;
const publickey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string;

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Add your name").max(100, "That name is too long"),
  email: z.string().email("That email doesn't look right"),
  message: z.string().trim().min(1, "Write a message first"),
});

type ContactFormData = z.infer<typeof ContactSchema>;
type Field = keyof ContactFormData;
type Status = "idle" | "sending" | "sent" | "failed";

const FIELD_ORDER: Field[] = ["name", "email", "message"];

const fieldClass = cn(
  "w-full bg-transparent px-3.5 text-[13px] text-primary outline-none",
  "placeholder:text-muted-foreground/60 caret-primary",
  "transition-colors duration-150 focus:bg-foreground/[0.025]",
  "aria-invalid:text-red-600 aria-invalid:placeholder:text-red-500/80",
  "dark:aria-invalid:text-red-400 dark:aria-invalid:placeholder:text-red-400/80",
);

const keyClass = cn(
  "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] px-1",
  "border border-foreground/10 bg-foreground/[0.03] font-sans text-[10px] leading-none text-muted-foreground",
  "shadow-[inset_0_-1px_0_hsl(var(--foreground)/0.08)]",
);

const ContactTile = () => {
  const [invalid, setInvalid] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [shortcut, setShortcut] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();

  const formRef = useRef<HTMLFormElement>(null);
  const hintId = useId();

  /* Platform is only knowable on the client, so the hint appears after mount
     rather than rendering one guess on the server and another on hydration. */
  useEffect(() => {
    const mac = /Mac|iPhone|iPad/.test(navigator.platform);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShortcut(mac ? "⌘" : "Ctrl");
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formValues = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const validation = ContactSchema.safeParse(formValues);
    if (!validation.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as Field;
        next[field] ??= issue.message;
      }
      setInvalid(next);

      // Send the reader to the first thing that needs fixing.
      const first = FIELD_ORDER.find((field) => next[field]);
      if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    setInvalid({});
    setStatus("sending");

    try {
      await emailjs.send(serviceId, templateId, validation.data, {
        publicKey: publickey,
      });
      setStatus("sent");
      form.reset();
    } catch (error) {
      console.log(error);
      setStatus("failed");
    }
  };

  const onMessageKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const clearError = (field: Field) => {
    if (invalid[field]) setInvalid((prev) => ({ ...prev, [field]: undefined }));
    if (status === "failed") setStatus("idle");
  };

  const firstError = FIELD_ORDER.map((field) => invalid[field]).find(Boolean);
  const sent = status === "sent";

  return (
    <div
      id="contact"
      className={cn(
        "col-span-2 lg:order-8 order-9 scroll-mt-24",
        "flex flex-col gap-3 bg-card rounded-2xl p-5 w-full card-glass",
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[15px] font-medium tracking-tight text-primary">
          Get in touch
        </h2>
        <p className="text-xs text-muted-foreground">
          Ideas, work, or just hello.
        </p>
      </div>

      <form
        ref={formRef}
        noValidate
        onSubmit={handleSubmit}
        className={cn(
          "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl",
          "border border-foreground/[0.08] bg-background/40",
          "transition-[border-color,box-shadow] duration-200",
          "focus-within:border-foreground/20 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.04)]",
        )}
      >
        <fieldset
          disabled={sent}
          className="flex min-h-0 flex-1 flex-col transition-[filter,opacity] duration-300 disabled:opacity-0 disabled:blur-[2px]"
        >
          <div className="grid grid-cols-1 border-b border-foreground/[0.08] sm:grid-cols-2">
            <label className="contents">
              <span className="sr-only">Name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Name"
                aria-invalid={Boolean(invalid.name)}
                aria-describedby={invalid.name ? hintId : undefined}
                onChange={() => clearError("name")}
                className={cn(fieldClass, "h-9")}
              />
            </label>
            <label className="contents">
              <span className="sr-only">Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email"
                aria-invalid={Boolean(invalid.email)}
                aria-describedby={invalid.email ? hintId : undefined}
                onChange={() => clearError("email")}
                className={cn(
                  fieldClass,
                  "h-9 border-t border-foreground/[0.08] sm:border-t-0 sm:border-l",
                )}
              />
            </label>
          </div>

          <label className="flex min-h-0 flex-1">
            <span className="sr-only">Message</span>
            <textarea
              name="message"
              placeholder="What's on your mind?"
              rows={3}
              aria-invalid={Boolean(invalid.message)}
                aria-describedby={invalid.message ? hintId : undefined}
              onChange={() => clearError("message")}
              onKeyDown={onMessageKeyDown}
              className={cn(
                fieldClass,
                "scrollbar min-h-24 flex-1 resize-none py-2.5 leading-relaxed lg:min-h-0",
              )}
            />
          </label>

          <div className="flex h-10 shrink-0 items-center justify-between gap-3 pl-3.5 pr-1.5">
            <p
              id={hintId}
              aria-live="polite"
              className={cn(
                "min-w-0 truncate text-[11px]",
                firstError || status === "failed"
                  ? "text-red-600 dark:text-red-400"
                  : "text-muted-foreground/70",
              )}
            >
              {firstError ??
                (status === "failed" ? (
                  "Couldn't send that. Please try again."
                ) : shortcut ? (
                  <span className="hidden items-center gap-1 pointer-fine:inline-flex">
                    <kbd className={keyClass}>{shortcut}</kbd>
                    <kbd className={keyClass}>Enter</kbd>
                    <span className="ml-0.5">to send</span>
                  </span>
                ) : null)}
            </p>

            <button
              type="submit"
              disabled={status === "sending"}
              className={cn(
                "group inline-flex h-7 shrink-0 items-center gap-1.5 rounded-lg px-3",
                "bg-primary text-[12px] font-medium text-primary-foreground",
                "transition-[opacity,transform] duration-150 active:scale-[0.97]",
                "hover:opacity-90 disabled:cursor-progress disabled:opacity-70",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
              )}
            >
              {status === "sending" ? "Sending" : "Send"}
              {status === "sending" ? (
                <Loader aria-hidden className="size-3.5 animate-spin" />
              ) : (
                <ArrowUp
                  aria-hidden
                  className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
                />
              )}
            </button>
          </div>
        </fieldset>

        {/* The live region is always mounted, so the success message is
            announced when it arrives rather than mounting with it. */}
        <div aria-live="polite">
          <AnimatePresence>
          {sent && (
            <motion.div
              initial={{ opacity: 0, filter: prefersReduced ? "none" : "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check aria-hidden className="size-4" strokeWidth={2.5} />
              </span>
              <p className="text-[13px] font-medium text-primary">
                Message sent
              </p>
              <p className="text-xs text-muted-foreground">
                Thanks for reaching out. I&apos;ll get back to you.
              </p>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
};

export default ContactTile;
