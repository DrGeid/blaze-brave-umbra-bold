import { clamp, round0 } from "./math";

export type FlareEvent = {
  time: string;
  maxClass: string;
};

export function flareScoreFromClass(maxClass: string): number {
  const m = maxClass.trim().toUpperCase().match(/^([ABCMX])(\d+(?:\.\d+)?)/);
  if (!m) return 0;
  const letter = m[1];
  const n = Math.min(Number(m[2]), 20);
  const base: Record<string, number> = { A: 2, B: 10, C: 28, M: 58, X: 84 };
  const span: Record<string, number> = { A: 8, B: 16, C: 28, M: 24, X: 16 };
  return clamp((base[letter] ?? 0) + (n / 9) * (span[letter] ?? 0), 0, 100);
}

export function bestFlare(events: FlareEvent[]): { maxClass: string; score: number } {
  let best = { maxClass: "None", score: 0 };
  for (const e of events) {
    const score = flareScoreFromClass(e.maxClass);
    if (score > best.score) best = { maxClass: e.maxClass, score };
  }
  return best;
}

/** R-scale (radio blackout) is the flare footprint on Earth. */
export function rForecastScore(opts: {
  scale: number | null;
  minorProb: number | null;
  majorProb: number | null;
}): { score: number; rScale: number; label: string } {
  const scale = opts.scale ?? 0;
  const scaleScore = [0, 38, 58, 78, 90, 100][clamp(round0(scale), 0, 5)] ?? 0;
  const minor = opts.minorProb ?? 0;
  const major = opts.majorProb ?? 0;
  const probScore = clamp(minor * 0.42 + major * 0.85, 0, 100);
  const score = Math.max(scaleScore, probScore);
  const rScale = scale > 0 ? scale : major >= 20 ? 3 : minor >= 40 ? 1 : 0;
  const label =
    scale >= 1
      ? `R${scale} radio blackout`
      : major >= 10
        ? `M/X flare odds ${round0(major)}%`
        : minor >= 15
          ? `C-class odds ${round0(minor)}%`
          : "No significant flare";
  return { score, rScale, label };
}
