export type EclipseEvent = {
  date: string;
  kind: "solar" | "lunar";
  name: string;
};

export type MercurySpan = {
  start: string;
  end: string;
  shadowStart: string;
  shadowEnd: string;
  label: string;
};

/** Visible or globally notable eclipses 2026–2028. Aug 2026 lunar is visible in North America. */
export const ECLIPSES: EclipseEvent[] = [
  { date: "2026-02-17", kind: "solar", name: "Annular solar eclipse" },
  { date: "2026-03-03", kind: "lunar", name: "Total lunar eclipse" },
  { date: "2026-08-12", kind: "solar", name: "Total solar eclipse" },
  { date: "2026-08-28", kind: "lunar", name: "Partial lunar eclipse" },
  { date: "2027-02-06", kind: "solar", name: "Annular solar eclipse" },
  { date: "2027-02-20", kind: "lunar", name: "Penumbral lunar eclipse" },
  { date: "2027-07-18", kind: "lunar", name: "Penumbral lunar eclipse" },
  { date: "2027-08-02", kind: "solar", name: "Total solar eclipse" },
  { date: "2027-08-17", kind: "lunar", name: "Penumbral lunar eclipse" },
  { date: "2028-01-12", kind: "lunar", name: "Partial lunar eclipse" },
  { date: "2028-01-26", kind: "solar", name: "Annular solar eclipse" },
  { date: "2028-07-06", kind: "lunar", name: "Partial lunar eclipse" },
  { date: "2028-07-21", kind: "solar", name: "Total solar eclipse" },
];

/** Eastern-time calendar dates (Almanac). Shadow = 14 days before start, 7 after end. */
export const MERCURY_SPANS: MercurySpan[] = [
  span("2026-02-26", "2026-03-20", "Mercury retrograde in Pisces"),
  span("2026-06-29", "2026-07-23", "Mercury retrograde in Cancer"),
  span("2026-10-24", "2026-11-13", "Mercury retrograde in Scorpio"),
  span("2027-02-09", "2027-03-03", "Mercury retrograde"),
  span("2027-06-10", "2027-07-04", "Mercury retrograde"),
  span("2027-10-07", "2027-10-28", "Mercury retrograde"),
  span("2028-01-24", "2028-02-14", "Mercury retrograde"),
  span("2028-05-21", "2028-06-14", "Mercury retrograde"),
  span("2028-09-19", "2028-10-11", "Mercury retrograde"),
];

function span(start: string, end: string, label: string): MercurySpan {
  return {
    start,
    end,
    shadowStart: shiftDate(start, -14),
    shadowEnd: shiftDate(end, 7),
    label,
  };
}

export function shiftDate(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  const ms =
    Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`);
  return Math.round(ms / 86_400_000);
}

export function nearestEclipse(date: string): {
  event: EclipseEvent;
  daysAway: number;
} | null {
  let best: { event: EclipseEvent; daysAway: number } | null = null;
  for (const event of ECLIPSES) {
    const daysAway = daysBetween(date, event.date);
    if (!best || Math.abs(daysAway) < Math.abs(best.daysAway)) {
      best = { event, daysAway };
    }
  }
  return best;
}

export function inEclipseSeason(date: string): boolean {
  const sorted = [...ECLIPSES].sort((a, b) => a.date.localeCompare(b.date));
  for (let i = 0; i < sorted.length - 1; i++) {
    const gap = daysBetween(sorted[i].date, sorted[i + 1].date);
    if (gap > 0 && gap <= 20) {
      if (date >= sorted[i].date && date <= sorted[i + 1].date) return true;
    }
  }
  return false;
}

export function mercuryState(date: string): {
  state: "direct" | "shadow" | "retrograde";
  label: string;
  until?: string;
} {
  for (const s of MERCURY_SPANS) {
    if (date >= s.start && date <= s.end) {
      return { state: "retrograde", label: s.label, until: s.end };
    }
  }
  for (const s of MERCURY_SPANS) {
    if (date >= s.shadowStart && date < s.start) {
      return {
        state: "shadow",
        label: `Pre-shadow · ${s.label}`,
        until: s.start,
      };
    }
    if (date > s.end && date <= s.shadowEnd) {
      return {
        state: "shadow",
        label: `Post-shadow · ${s.label}`,
        until: s.shadowEnd,
      };
    }
  }
  const next = MERCURY_SPANS.find((s) => s.start > date);
  return {
    state: "direct",
    label: next ? `Direct until ${formatShort(next.start)}` : "Direct",
    until: next?.start,
  };
}

function formatShort(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}
