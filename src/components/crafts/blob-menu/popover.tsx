"use client";

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useLayoutEffect,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
} from "react";

import { AnimatePresence, motion, type Variants } from "motion/react";

type MorphMenuContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  filterId: string;
  cardWidth: number;
  cardHeight: number;
  triggerHeight: number;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  gap: number;
};

const MorphMenuContext = createContext<MorphMenuContextValue | null>(null);

function useMorphMenu() {
  const value = useContext(MorphMenuContext);
  if (!value) {
    throw new Error("MorphMenu parts must be used within MorphMenu.");
  }
  return value;
}

type MorphMenuProps = {
  children: ReactNode;
  open?: boolean;
  onOpenChangeAction?: (open: boolean) => void;
  defaultOpen?: boolean;
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  className?: string;
};

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.24, duration: 0.14 } },
  exit: { opacity: 0, transition: { duration: 0.07 } },
};

export default function MorphMenu({
  children,
  open: controlledOpen,
  onOpenChangeAction,
  defaultOpen = false,
  cardWidth = 220,
  cardHeight = 188,
  gap = 5,
  className = "",
}: MorphMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [triggerHeight, setTriggerHeight] = useState(56);
  const triggerRef = useRef<HTMLDivElement>(null);
  const open = controlledOpen ?? uncontrolledOpen;
  const filterId = useId().replace(/:/g, "");

  const setOpen = (next: boolean) => {
    onOpenChangeAction?.(next);
    if (controlledOpen === undefined) {
      setUncontrolledOpen(next);
    }
  };

  useLayoutEffect(() => {
    const node = triggerRef.current;
    if (!node) return;

    const update = () => {
      setTriggerHeight(node.offsetHeight || 56);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      filterId,
      cardWidth,
      cardHeight,
      triggerHeight,
      triggerRef,
      gap,
    }),
    [open, filterId, cardWidth, cardHeight, triggerHeight, gap]
  );

  return (
    <MorphMenuContext.Provider value={value}>
      <svg
        aria-hidden
        focusable="false"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        <defs>
          <filter id={filterId} x="-15%" y="-15%" width="130%" height="230%">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div
        className={`relative overflow-visible flex flex-col items-center pt-4 ${className}`.trim()}
      >
        {children}
      </div>
    </MorphMenuContext.Provider>
  );
}

type MorphMenuTriggerProps = {
  children: ReactElement;
};

export function MorphMenuTrigger({ children }: MorphMenuTriggerProps) {
  const { open, setOpen, triggerRef } = useMorphMenu();
  const child = Children.only(children);

  if (!isValidElement<{ onClick?: MouseEventHandler }>(child)) {
    return null;
  }

  const handleClick: MouseEventHandler = (event) => {
    child.props.onClick?.(event);
    setOpen(!open);
  };

  return (
    <div ref={triggerRef}>
      {cloneElement(child, {
        onClick: handleClick,
      })}
    </div>
  );
}

type MorphMenuContentProps = {
  children: ReactNode;
  className?: string;
};

export function MorphMenuContent({
  children,
  className = "",
}: MorphMenuContentProps) {
  const { open, filterId, cardWidth, cardHeight, triggerHeight, gap } =
    useMorphMenu();

  const cardStartY = cardHeight / 1.5 + gap;

  const contentShapeVariants: Variants = {
    hidden: { y: cardStartY, scale: 0 },
    visible: {
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 28 },
    },
    exit: {
      y: cardStartY,
      scale: 0,
      transition: { type: "spring", stiffness: 420, damping: 30 },
    },
  };

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2"
      style={{
        width: cardWidth,
        height: cardHeight,
        bottom: triggerHeight + gap,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
          filter: `url(#${filterId})`,
        }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              variants={contentShapeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                width: cardWidth,
                height: cardHeight,
              }}
              className="rounded-2xl bg-foreground"
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              width: cardWidth,
              height: cardHeight,
            }}
            className={`absolute inset-0 overflow-hidden rounded-2xl pointer-events-auto p-2 ${className}`.trim()}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
