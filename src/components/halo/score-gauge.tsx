import { bandLabel } from "@/lib/halo/format";
import type { Band } from "@/lib/halo/types";
import { cn } from "@/lib/utils";

export function ScoreGauge({
  score,
  band,
  label,
  size = "lg",
}: {
  score: number;
  band: Band;
  label: string;
  size?: "lg" | "sm";
}) {
  const r = size === "lg" ? 54 : 36;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const dim = size === "lg" ? 140 : 96;
  const tone =
    band === "quiet"
      ? "text-calm"
      : band === "watch" || band === "elevated"
        ? "text-watch"
        : "text-high";

  return (
    <div className={cn("relative", size === "lg" ? "size-[140px]" : "size-24")}>
      <svg viewBox={`0 0 ${dim} ${dim}`} className="size-full -rotate-90">
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-surface-2"
          strokeWidth={size === "lg" ? 8 : 6}
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className={tone}
          strokeWidth={size === "lg" ? 8 : 6}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className={cn("font-display tabular-nums leading-none", size === "lg" ? "text-4xl" : "text-2xl")}>
            {score}
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.14em] text-faint">
            {bandLabel(band)}
          </div>
        </div>
      </div>
      <span className="sr-only">{label} {score}</span>
    </div>
  );
}
