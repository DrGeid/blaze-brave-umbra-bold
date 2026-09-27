import type { Band, PhenotypeId } from "./types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const WEEKDAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatLongDate(iso: string): string {
  const d = parseIsoDate(iso);
  return `${WEEKDAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function formatShortDate(iso: string): string {
  const d = parseIsoDate(iso);
  return `${WEEKDAYS_SHORT[d.getDay()]} ${d.getDate()}`;
}

export function formatMonthDay(iso: string): string {
  const d = parseIsoDate(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function bandLabel(band: Band): string {
  switch (band) {
    case "quiet":
      return "Quiet";
    case "watch":
      return "Watch";
    case "elevated":
      return "Elevated";
    case "high":
      return "High";
    case "peak":
      return "Peak";
  }
}

export function phenotypeNoun(id: PhenotypeId): string {
  if (id === "temple") return "temple squeeze";
  if (id === "frontal") return "frontal pressure";
  if (id === "ocular") return "ocular strain";
  if (id === "sleep") return "sleep disruption";
  return "occipital tension";
}
