import { EVIDENCE_COPY, FACTOR_META, LOAD_MAX } from "@/lib/halo/constants";
import type { FactorScore } from "@/lib/halo/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function FactorList({
  factors,
  lift,
}: {
  factors: FactorScore[];
  lift?: Partial<Record<string, number>>;
}) {
  const ranked = [...factors].sort((a, b) => b.score - a.score);
  const sum = factors.reduce((a, f) => a + f.score, 0);

  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-faint">Factors</p>
          <h2 className="mt-1 font-display text-2xl">Each term, then the sum</h2>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl tabular-nums leading-none">{sum}</p>
          <p className="mt-1 text-xs text-faint">of {LOAD_MAX.toLocaleString()} load</p>
        </div>
      </div>
      <ol className="mt-6 space-y-4">
        {ranked.map((f) => (
          <li key={f.id}>
            <div className="flex items-baseline justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="font-medium">{FACTOR_META[f.id].label}</span>
                <Badge tone={f.evidence}>{EVIDENCE_COPY[f.evidence]}</Badge>
                {lift?.[f.id] != null && Math.abs(lift[f.id]!) >= 0.12 ? (
                  <Badge tone="strong">
                    {lift[f.id]! > 0 ? "Your journal +" : "Your journal −"}
                  </Badge>
                ) : null}
              </div>
              <span className="font-display text-xl tabular-nums">{f.score}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className={cn(
                  "h-full rounded-full",
                  f.evidence === "strong"
                    ? "bg-primary"
                    : f.evidence === "mixed"
                      ? "bg-watch/70"
                      : "bg-faint/50",
                )}
                style={{ width: `${f.score}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted">
              <span className="text-fg">{f.observed}</span>
              {" · "}
              {f.note}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
