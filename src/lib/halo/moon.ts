import { clamp, circularDist } from "./math";

/** Synodic month from a known new moon (6 Jan 2000 18:14 UTC). */
const SYNODIC = 29.530588853;
const KNOWN_NEW = Date.UTC(2000, 0, 6, 18, 14, 0);
const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);

export function moonPhase(dateIso: string): number {
  const t = Date.parse(`${dateIso}T12:00:00Z`);
  const days = (t - KNOWN_NEW) / 86_400_000;
  const phase = days / SYNODIC - Math.floor(days / SYNODIC);
  return (phase + 1) % 1;
}

export function moonIllumination(phase: number): number {
  return (1 - Math.cos(phase * 2 * Math.PI)) / 2;
}

export function moonName(phase: number): string {
  if (phase < 0.03 || phase >= 0.97) return "New moon";
  if (phase < 0.22) return "Waxing crescent";
  if (phase < 0.28) return "First quarter";
  if (phase < 0.47) return "Waxing gibbous";
  if (phase < 0.53) return "Full moon";
  if (phase < 0.72) return "Waning gibbous";
  if (phase < 0.78) return "Last quarter";
  return "Waning crescent";
}

/** Mean anomaly in turns; 0 ≈ perigee (Meeus from J2000). */
export function lunarAnomalyTurns(dateIso: string): number {
  const t = Date.parse(`${dateIso}T12:00:00Z`);
  const d = (t - J2000) / 86_400_000;
  const m = (134.96340251 + 13.0649929509 * d) / 360;
  return ((m % 1) + 1) % 1;
}

export function perigeeProximity(dateIso: string): number {
  const a = lunarAnomalyTurns(dateIso);
  const dist = Math.min(a, 1 - a);
  return clamp(1 - dist / 0.18, 0, 1);
}

/** Spring-tide strength 0–1 from syzygy (new/full) plus perigee. Not Lake Ontario water level. */
export function springTideStrength(dateIso: string): {
  strength: number;
  perigee: number;
  label: string;
} {
  const phase = moonPhase(dateIso);
  const dNew = circularDist(phase, 0);
  const dFull = circularDist(phase, 0.5);
  const nearest = Math.min(dNew, dFull);
  const spring = clamp(1 - nearest / 0.25, 0, 1);
  const perigee = perigeeProximity(dateIso);
  const strength = clamp(0.74 * spring + 0.26 * perigee, 0, 1);
  const which = dNew <= dFull ? "new-moon" : "full-moon";
  let label = "Neap / middling tide";
  if (spring >= 0.72 && perigee >= 0.55) label = `Perigean spring tide (${which})`;
  else if (spring >= 0.72) label = `Spring tide (${which} alignment)`;
  else if (spring >= 0.35) label = "Building toward spring tide";
  else if (perigee >= 0.7) label = "Perigee, not spring";
  return { strength, perigee, label };
}
