import { MonthFormat } from "@/types/enums";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateToMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);
}

export function formatDate(date: Date, monthFormat: MonthFormat): string {
  return date.toLocaleDateString("en-US", {
    month: monthFormat,
    day: "numeric",
    year: "numeric",
  });
}
