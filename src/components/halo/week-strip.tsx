import { bandLabel, formatShortDate } from "@/lib/halo/format";
import type { DayResult } from "@/lib/halo/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function WeekStrip({
  days,
  selected,
  onSelect,
}: {
  days: DayResult[];
  selected: string;
  onSelect: (date: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
      {days.map((d, i) => {
        const active = d.date === selected;
        return (
          <button
            key={d.date}
            type="button"
            onClick={() => onSelect(d.date)}
            className={cn(
              "rounded-lg bg-surface px-3 py-3 text-left shadow-[var(--shadow-border)] transition-transform duration-150",
              active && "ring-1 ring-primary/35",
            )}
          >
            <p className="text-xs text-faint">{i === 0 ? "Today" : formatShortDate(d.date)}</p>
            <p className="mt-1 font-display text-2xl tabular-nums leading-none">{d.opportunity}</p>
            <div className="mt-2">
              <Badge tone={d.band}>{bandLabel(d.band)}</Badge>
            </div>
            <p className="mt-2 text-[11px] leading-snug text-muted">
              T {d.phenotypes.temple.score} · F {d.phenotypes.frontal.score} · E {d.phenotypes.ocular.score}
              <br />
              N {d.phenotypes.occipital.score} · S {d.phenotypes.sleep.score}
            </p>
          </button>
        );
      })}
    </div>
  );
}
