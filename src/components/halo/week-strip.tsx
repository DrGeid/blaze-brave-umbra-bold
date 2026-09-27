import { useState } from "react";
import { bandLabel, formatShortDate } from "@/lib/halo/format";
import { forecastDateWindow } from "@/lib/halo/date-window";
import type { DayResult } from "@/lib/halo/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function WeekStrip({
  days,
  today,
  selected,
  onSelect,
}: {
  days: DayResult[];
  today: string;
  selected: string;
  onSelect: (date: string) => void;
}) {
  const [history, setHistory] = useState(false);
  const dates = forecastDateWindow(today).filter((date) =>
    history ? date < today : date >= today,
  );
  const available = dates.filter((date) => days.some((day) => day.date === date));
  function changeWindow(past: boolean) {
    setHistory(past);
    const choices = days.filter((day) => (past ? day.date < today : day.date >= today));
    const next = past ? choices.at(-1) : choices[0];
    if (next) onSelect(next.date);
  }
  return (
    <section aria-label="Forecast dates">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-pressed={history}
          onClick={() => changeWindow(true)}
          className={cn(
            "min-h-11 rounded-full px-4 text-sm",
            history ? "bg-primary text-primary-fg" : "bg-surface text-muted",
          )}
        >
          Past 7 days
        </button>
        <button
          type="button"
          aria-pressed={!history}
          onClick={() => changeWindow(false)}
          className={cn(
            "min-h-11 rounded-full px-4 text-sm",
            !history ? "bg-primary text-primary-fg" : "bg-surface text-muted",
          )}
        >
          Today + next 7 days
        </button>
      </div>
      <p className="mb-3 text-xs text-muted">
        {history
          ? "Historical scores calculated from archived weather estimates."
          : "Today's forecast and seven days ahead."}
        {available.length < dates.length
          ? " Some dates are temporarily unavailable from the weather provider."
          : ""}
      </p>
      <div
        className={cn(
          "grid grid-cols-2 gap-2 sm:grid-cols-4",
          history ? "lg:grid-cols-7" : "lg:grid-cols-8",
        )}
      >
        {dates.map((date) => {
          const d = days.find((day) => day.date === date);
          return (
            <button
              key={date}
              type="button"
              disabled={!d}
              aria-pressed={selected === date}
              aria-label={`${date === today ? "Today" : formatShortDate(date)} ${history ? "historical score" : "forecast"}`}
              onClick={() => onSelect(date)}
              className={cn(
                "rounded-lg bg-surface px-3 py-3 text-left shadow-[var(--shadow-border)] transition-colors duration-150 disabled:opacity-50",
                selected === date && "ring-2 ring-primary/50",
              )}
            >
              <p className="text-xs text-faint">
                {date === today ? "Today" : formatShortDate(date)}
              </p>
              {d ? (
                <>
                  <p className="mt-1 font-display text-2xl tabular-nums leading-none">
                    {d.opportunity}
                  </p>
                  <div className="mt-2">
                    <Badge tone={d.band}>{bandLabel(d.band)}</Badge>
                  </div>
                  <p className="mt-2 text-xs leading-snug text-muted">
                    T {d.phenotypes.temple.score} · F {d.phenotypes.frontal.score} · E{" "}
                    {d.phenotypes.ocular.score}
                    <br />N {d.phenotypes.occipital.score} · S {d.phenotypes.sleep.score}
                  </p>
                </>
              ) : (
                <p className="mt-3 text-xs text-muted">Unavailable</p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
