import { clamp, round0 } from "./math";

/** Southern Ontario phenology (tree → grass → ragweed). CAMS pollen is Europe-only. */
export function seasonalPollen(
  date: string,
  tempMean: number | null,
  precip: number | null,
  wind: number | null,
): { index: number; label: string } {
  const parts = date.split("-").map(Number);
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const doy = dayOfYear(month, day);
  const tree = bump(doy, 85, 112, 145);
  const grass = bump(doy, 140, 166, 208);
  const ragweed = bump(doy, 218, 236, 282);
  const raw = Math.max(tree, grass, ragweed);
  let kind = "Off season";
  if (ragweed >= grass && ragweed >= tree && ragweed > 8) kind = "Ragweed";
  else if (grass >= tree && grass > 8) kind = "Grass";
  else if (tree > 8) kind = "Tree";

  const t = tempMean ?? 12;
  const tempMod = t < 4 ? 0.12 : t < 10 ? 0.45 : t < 16 ? 0.75 : t > 33 ? 0.7 : 1;
  const rain = precip ?? 0;
  const rainMod = rain >= 10 ? 0.22 : rain >= 3 ? 0.5 : rain >= 0.8 ? 0.78 : 1;
  const w = wind ?? 10;
  const windMod = w < 4 ? 0.7 : w < 12 ? 1 : w < 28 ? 1.12 : 1.05;
  const index = clamp(raw * tempMod * rainMod * windMod, 0, 100);
  if (index < 6) return { index: round0(index), label: "Low / off season" };
  return { index: round0(index), label: `${kind} · ${round0(index)}/100` };
}

function dayOfYear(month: number, day: number): number {
  const md = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let n = day;
  for (let i = 1; i < month; i++) n += md[i];
  return n;
}

function bump(x: number, start: number, peak: number, end: number): number {
  if (x <= start || x >= end) return 0;
  if (x <= peak) return 100 * ((x - start) / Math.max(1, peak - start));
  return 100 * ((end - x) / Math.max(1, end - peak));
}
