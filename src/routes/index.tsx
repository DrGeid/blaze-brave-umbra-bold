import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { FactorList } from "@/components/halo/factor-list";
import { PhenotypeCard } from "@/components/halo/phenotype-card";
import { PressureChart } from "@/components/halo/pressure-chart";
import { ScoreGauge } from "@/components/halo/score-gauge";
import { WeekStrip } from "@/components/halo/week-strip";
import { Badge } from "@/components/ui/badge";
import { getHaloForecast } from "@/lib/halo/fetch-forecast";
import { nowcastCopy } from "@/lib/halo/briefing";
import { PHENOTYPE_META } from "@/lib/halo/constants";
import { bandLabel, formatLongDate } from "@/lib/halo/format";
import { useLearned } from "@/lib/halo/journal-store";
import { buildDayResult } from "@/lib/halo/scoring";
import type { HaloForecast, PhenotypeId } from "@/lib/halo/types";
import { PHENOTYPES } from "@/lib/halo/types";

export const Route = createFileRoute("/")({
  loader: () => getHaloForecast(),
  component: Home,
  pendingComponent: Pending,
});

function Home() {
  const data = Route.useLoaderData() as HaloForecast;
  const [date, setDate] = useState(data.today.date);
  const [focus, setFocus] = useState<PhenotypeId>("temple");
  const learned = useLearned();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const selected = useMemo(() => {
    const raw = data.days.find((d) => d.date === date) ?? data.today;
    if (!hydrated || !learned.ready) return raw;
    const idx = data.days.findIndex((d) => d.date === raw.date);
    const prevMean = idx > 0 ? data.days[idx - 1].weather.tempMean : null;
    return {
      ...buildDayResult(raw.weather, raw.sky, prevMean, learned.weights),
      dataNotes: raw.dataNotes,
    };
  }, [data, date, learned, hydrated]);

  const lift: Partial<Record<string, number>> = {};
  for (const i of learned.insights) {
    const prev = lift[i.factor] ?? 0;
    if (Math.abs(i.lift) > Math.abs(prev)) lift[i.factor] = i.lift;
  }

  const lead = PHENOTYPES.map((id) => selected.phenotypes[id]).sort((a, b) => b.score - a.score)[0];

  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-xs uppercase tracking-[0.18em] text-faint">{data.location.region}</p>
        <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl sm:text-5xl">{formatLongDate(selected.date)}</h1>
            <p className="mt-2 text-sm font-medium text-muted">
              {selected.date < data.today.date
                ? "Historical weather estimate"
                : selected.date === data.today.date
                  ? "Today's forecast"
                  : "Forecast"}
            </p>
            <p className="mt-3 text-lg text-muted">{selected.headline}</p>
            <p className="mt-2 text-sm text-faint">{nowcastCopy(selected)}</p>
          </div>
          <div className="flex items-center gap-5 rounded-xl bg-surface px-5 py-4 shadow-[var(--shadow-border)]">
            <ScoreGauge score={selected.opportunity} band={selected.band} label="Opportunity" />
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-faint">Opportunity</p>
              <p className="mt-1 font-display text-lg">{bandLabel(selected.band)}</p>
              <p className="text-sm text-muted">
                Load {selected.load} / {selected.loadMax}
              </p>
              {learned.ready ? (
                <Badge tone="strong" className="mt-2">
                  Tuned by journal
                </Badge>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <WeekStrip days={data.days} today={data.today.date} selected={date} onSelect={setDate} />
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PHENOTYPES.map((id) => (
            <PhenotypeCard
              key={id}
              score={selected.phenotypes[id]}
              active={focus === id}
              onSelect={() => setFocus(id)}
            />
          ))}
        </div>

        <section className="mt-6 rounded-xl bg-primary px-5 py-5 text-primary-fg sm:px-6">
          <p className="text-xs uppercase tracking-[0.16em] opacity-70">
            {PHENOTYPE_META[focus].label}
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed opacity-90">
            {PHENOTYPE_META[focus].detail} Default weights favour published weather and air-quality
            signals. Anecdotal sky terms stay small until enough quiet-versus-attack days are logged
            on this device. Sleep is scored as disruption risk — a high number means a harder night,
            which can open the door to an attack. Frontal pressure is the forehead / “sinus” map,
            kept separate from a temple vice and from pain behind the eyes.
          </p>
        </section>

        <div className="mt-6">
          <FactorList factors={selected.factors} lift={lift} />
        </div>
        {selected.dataNotes?.length ? (
          <aside
            className="mt-4 rounded-lg border border-border p-4 text-xs leading-relaxed text-muted"
            aria-label="Data notes"
          >
            {selected.dataNotes.map((note) => (
              <p key={note} className="mb-1">
                {note}
              </p>
            ))}
          </aside>
        ) : null}

        <div className="mt-6">
          <PressureChart hourly={data.hourly} />
        </div>

        <p className="mt-8 text-xs text-faint">
          {data.source}. {data.disclaimer}
        </p>
        <p className="sr-only">Lead phenotype {lead.id}</p>
      </main>
    </AppShell>
  );
}

function Pending() {
  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="h-10 w-64 animate-pulse rounded-md bg-surface-2" />
        <div className="mt-4 h-6 w-full max-w-md animate-pulse rounded-md bg-surface-2" />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      </main>
    </AppShell>
  );
}
