"use client";

import { useId, useRef, useState } from "react";

import { Check, PenLine } from "lucide-react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useAnimate,
} from "motion/react";

import { cn } from "@/lib/utils";

type Unit = "hours" | "minutes";
type Duration = Record<Unit, number>;

const SPRING = { type: "spring", bounce: 0.25, duration: 0.55 } as const;
// Each piece springs on its own, a beat after the one before it.
const PIECE = { type: "spring", bounce: 0.4, duration: 0.6 } as const;
// Closing snaps shut faster than it opens.
const SNAP = { type: "spring", bounce: 0.3, duration: 0.4 } as const;
const STAGGER = 0.04;

// Wide enough apart that the goo lets go once they settle.
const GAP = 10;

// Pieces sit snug while closed and get room to breathe while editing.
type Width = { closed: number; open: number };
const FIELDS: { unit: Unit; label: string; max: number; width: Width }[] = [
  { unit: "hours", label: "hr", max: 23, width: { closed: 62, open: 72 } },
  { unit: "minutes", label: "min", max: 59, width: { closed: 70, open: 84 } },
];
const TOGGLE: Width = { closed: 42, open: 40 };

const pad = (n: number) => String(n).padStart(2, "0");

export default function DurationPicker() {
  const [value, setValue] = useState<Duration>({ hours: 1, minutes: 30 });
  const [draft, setDraft] = useState<Record<Unit, string>>({
    hours: "01",
    minutes: "30",
  });
  const [editing, setEditing] = useState(false);
  const [focused, setFocused] = useState<Unit>("hours");
  const gooId = useId();

  const inputRefs = useRef<Record<Unit, HTMLInputElement | null>>({
    hours: null,
    minutes: null,
  });
  const [hoursScope, animateHours] = useAnimate<HTMLSpanElement>();
  const [minutesScope, animateMinutes] = useAnimate<HTMLSpanElement>();
  const scopes = { hours: hoursScope, minutes: minutesScope };

  const shake = (unit: Unit) => {
    const animate = unit === "hours" ? animateHours : animateMinutes;
    animate(
      scopes[unit].current,
      { x: [0, -3, 3, -1.5, 1.5, 0] },
      { duration: 0.28 },
    );
  };

  const invalid = (unit: Unit) =>
    Number(draft[unit]) > FIELDS.find((f) => f.unit === unit)!.max;

  // A field past its ceiling can't be set. Trying shakes it again.
  const guard = (units: Unit[]) => {
    const bad = units.filter(invalid);
    bad.forEach(shake);
    if (bad.length) inputRefs.current[bad[0]]?.focus();
    return bad.length === 0;
  };

  const open = () => {
    setDraft({ hours: pad(value.hours), minutes: pad(value.minutes) });
    setEditing(true);
    inputRefs.current.hours?.focus();
    inputRefs.current.hours?.select();
  };

  const confirm = () => {
    if (!guard(["hours", "minutes"])) return;
    setValue({
      hours: Number(draft.hours) || 0,
      minutes: Number(draft.minutes) || 0,
    });
    setDraft((d) => ({
      hours: pad(Number(d.hours) || 0),
      minutes: pad(Number(d.minutes) || 0),
    }));
    setEditing(false);
    for (const input of Object.values(inputRefs.current)) {
      input?.setSelectionRange(0, 0);
      input?.blur();
    }
  };

  const cancel = () => {
    setDraft({ hours: pad(value.hours), minutes: pad(value.minutes) });
    setEditing(false);
  };

  // Anything past the ceiling stays as typed, turns red and shakes.
  const write = (unit: Unit, max: number, raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(-2);
    if (Number(digits) > max) shake(unit);
    setDraft((d) => ({ ...d, [unit]: digits }));
  };

  const step = (unit: Unit, max: number, by: number) => {
    const next =
      ((((Number(draft[unit]) || 0) + by) % (max + 1)) + max + 1) % (max + 1);
    setDraft((d) => ({ ...d, [unit]: pad(next) }));
  };

  const onKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    unit: Unit,
    max: number,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (unit === "minutes") confirm();
      else if (guard(["hours"])) inputRefs.current.minutes?.focus();
    } else if (e.key === "Escape") {
      cancel();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      step(unit, max, e.key === "ArrowUp" ? 1 : -1);
    }
  };

  const parts = [...FIELDS.map((f) => f.width), TOGGLE];
  // Everything after the first piece steps away from the one before it.
  const piece = (i: number) => ({
    initial: false as const,
    animate: {
      marginLeft: i > 0 && editing ? GAP : 0,
      width: editing ? parts[i].open : parts[i].closed,
    },
    transition: editing
      ? { ...PIECE, delay: i * STAGGER }
      : { ...SNAP, delay: (parts.length - 1 - i) * STAGGER * 0.5 },
  });

  return (
    <MotionConfig reducedMotion="user" transition={SPRING}>
      <div className="flex w-full grow items-center justify-center">
        <svg aria-hidden className="absolute size-0">
          <filter id={gooId} colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" />
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" />
            <feComposite in="SourceGraphic" operator="atop" />
          </filter>
        </svg>

        <div role="group" aria-label="Duration" className="relative flex h-10">
          <div
            aria-hidden
            style={{ filter: `url(#${gooId})` }}
            className="absolute inset-0 flex"
          >
            {parts.map((_, i) => (
              <motion.div
                key={i}
                {...piece(i)}
                className="shrink-0 rounded-full bg-foreground"
              />
            ))}

            <motion.div
              initial={false}
              animate={{ scaleY: editing ? 0 : 1 }}
              transition={
                editing
                  ? { duration: 0.3, ease: "easeOut" }
                  : { duration: 0.18, ease: "easeOut", delay: 0.02 }
              }
              className="absolute inset-y-0 right-5 left-5 bg-foreground"
            />
          </div>

          {FIELDS.map(({ unit, label, max }, i) => (
            <motion.label
              key={unit}
              {...piece(i)}
              onClick={() => !editing && open()}
              className={cn(
                "relative flex shrink-0 items-baseline justify-center gap-1 self-center text-sm tabular-nums",
                editing ? "cursor-text" : "cursor-pointer",
              )}
            >
              <span ref={scopes[unit]} className="flex items-baseline gap-1">
                <input
                  ref={(el) => {
                    inputRefs.current[unit] = el;
                  }}
                  value={draft[unit]}
                  onChange={(e) => write(unit, max, e.target.value)}
                  onKeyDown={(e) => onKeyDown(e, unit, max)}
                  onFocus={(e) => {
                    setFocused(unit);
                    e.target.select();
                  }}
                  readOnly={!editing}
                  tabIndex={editing ? 0 : -1}
                  inputMode="numeric"
                  aria-label={unit}
                  aria-invalid={invalid(unit)}
                  className={cn(
                    "w-[2ch] cursor-[inherit] bg-transparent text-right font-medium text-background outline-none transition-[opacity,color] selection:bg-background/25",
                    editing && focused !== unit && "opacity-50",
                    invalid(unit) && "text-red-400 dark:text-red-600",
                  )}
                />
                <span
                  className={cn(
                    "text-background/55 transition-colors",
                    invalid(unit) && "text-red-400/70 dark:text-red-600/70",
                  )}
                >
                  {label}
                </span>
              </span>
            </motion.label>
          ))}

          <motion.button
            type="button"
            {...piece(FIELDS.length)}
            onMouseDown={(e) => editing && e.preventDefault()}
            onClick={editing ? confirm : open}
            aria-label={editing ? "Confirm duration" : "Edit duration"}
            className="relative grid shrink-0 cursor-pointer place-items-center rounded-full text-background/60 outline-none transition-colors hover:text-background focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={editing ? "check" : "pen"}
                initial={{ opacity: 0, scale: 0.6, filter: "blur(3px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.6, filter: "blur(3px)" }}
                transition={{ duration: 0.18 }}
              >
                {editing ? (
                  <Check className="size-4" strokeWidth={2.25} />
                ) : (
                  <PenLine className="size-4" strokeWidth={2} />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </MotionConfig>
  );
}
