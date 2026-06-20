import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function formatDate(date: Date | string, locale: string = "fr"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export function formatShortDate(date: Date | string, locale: string = "fr"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", { day: "2-digit", month: "short" });
}

export function slugify(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export function isUpcoming(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return d >= new Date();
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}