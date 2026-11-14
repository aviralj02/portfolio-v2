"use client";

import { useEffect, useRef } from "react";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  /** Id of the element that names the dialog, usually its heading. */
  labelledBy?: string;
  children?: React.ReactNode;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SPRING = {
  type: "spring",
  stiffness: 360,
  damping: 38,
  mass: 0.9,
} as const;

const Modal = ({ isOpen, onClose, labelledBy, children }: Props) => {
  const panelRef = useRef<HTMLDivElement>(null);

  /* Read through a ref so a new onClose each render doesn't rerun the focus
     effect, which would bounce focus back to the opener and in again. */
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    /* Focus moves into the dialog and comes back to whatever opened it. */
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
      if (e.key !== "Tab" || !panelRef.current) return;

      /* Keep Tab cycling inside the dialog. */
      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelledBy}
              tabIndex={-1}
              className={cn(
                "pointer-events-auto relative isolate outline-none",
                "w-full sm:w-[480px]",
                "rounded-t-3xl sm:rounded-3xl",
                "max-h-[88dvh] sm:max-h-[80dvh]",
                "flex flex-col"
              )}
              /* The panel itself stays opaque on the way in: anything flying
                 into it through a shared layoutId would otherwise inherit
                 its fade and dim mid-flight. Its surface and close button
                 fade instead, and the content animates itself. */
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={SPRING}
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 -z-10 rounded-t-3xl sm:rounded-3xl bg-card shadow-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={SPRING}
              />

              <motion.button
                onClick={onClose}
                className="absolute cursor-pointer top-3 right-3 z-10 grid place-items-center size-8 rounded-full bg-card card-glass text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-text/60"
                aria-label="Close"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={SPRING}
              >
                <X className="size-4" />
              </motion.button>

              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
