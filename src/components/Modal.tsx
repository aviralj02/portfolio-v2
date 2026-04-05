"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: Props) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

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
              role="dialog"
              aria-modal="true"
              className={cn(
                "pointer-events-auto relative",
                "w-full sm:w-[480px]",
                "rounded-t-3xl sm:rounded-3xl",
                "bg-card shadow-2xl",
                "max-h-[88vh] sm:max-h-[80vh]",
                "flex flex-col"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 360,
                damping: 38,
                mass: 0.9,
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/25 hover:bg-black/40 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
