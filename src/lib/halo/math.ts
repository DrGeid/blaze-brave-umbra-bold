export function clamp(n: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, n));
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function round0(n: number): number {
  return Math.round(n);
}

/** Piecewise linear interpolation, then clamp 0–100. */
export function scoreLine(
  value: number,
  points: Array<[number, number]>,
): number {
  if (points.length === 0) return 0;
  if (value <= points[0][0]) return clamp(points[0][1], 0, 100);
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    if (value <= x1) {
      const t = x1 === x0 ? 0 : (value - x0) / (x1 - x0);
      return clamp(y0 + t * (y1 - y0), 0, 100);
    }
  }
  return clamp(points[points.length - 1][1], 0, 100);
}

export function mean(values: Array<number | null | undefined>): number | null {
  const xs = values.filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  if (xs.length === 0) return null;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function maxNum(values: Array<number | null | undefined>): number | null {
  const xs = values.filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  if (xs.length === 0) return null;
  return Math.max(...xs);
}

export function minNum(values: Array<number | null | undefined>): number | null {
  const xs = values.filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  if (xs.length === 0) return null;
  return Math.min(...xs);
}

export function sum(values: Array<number | null | undefined>): number {
  return values.reduce<number>((a, b) => a + (typeof b === "number" && Number.isFinite(b) ? b : 0), 0);
}

export function circularDist(phase: number, target: number): number {
  const d = Math.abs(phase - target);
  return Math.min(d, 1 - d);
}
