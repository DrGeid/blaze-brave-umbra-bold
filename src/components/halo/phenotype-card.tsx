import { PHENOTYPE_META } from "@/lib/halo/constants";
import { bandLabel } from "@/lib/halo/format";
import type { PhenotypeScore } from "@/lib/halo/types";
import { FACTOR_META } from "@/lib/halo/constants";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge } from "./score-gauge";
import { cn } from "@/lib/utils";

export function PhenotypeCard({
  score,
  active,
  onSelect,
}: {
  score: PhenotypeScore;
  active?: boolean;
  onSelect?: () => void;
}) {
  const meta = PHENOTYPE_META[score.id];
  const top = score.contributions[0];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col items-start gap-4 rounded-xl bg-surface p-5 text-left shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-200",
        active && "ring-1 ring-primary/30",
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-faint">{score.id}</p>
          <h3 className="mt-1 font-display text-2xl">{meta.label}</h3>
        </div>
        <Badge tone={score.band}>{bandLabel(score.band)}</Badge>
      </div>
      <div className="flex w-full items-center gap-5">
        <ScoreGauge score={score.score} band={score.band} label={meta.label} />
        <p className="min-w-0 flex-1 text-sm text-muted">{meta.feel}</p>
      </div>
      {top ? (
        <p className="text-xs text-faint">
          Loudest term · {FACTOR_META[top.id].label}
        </p>
      ) : null}
    </button>
  );
}
