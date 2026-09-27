import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { FACTOR_META, PHENOTYPE_META } from "@/lib/halo/constants";
import { getHaloForecast } from "@/lib/halo/fetch-forecast";
import { formatMonthDay } from "@/lib/halo/format";
import { INTENSITY_LABEL, SLEEP_LABEL, useJournal, useLearned } from "@/lib/halo/journal-store";
import type { FactorId, HaloForecast, Intensity, PhenotypeId } from "@/lib/halo/types";
import { PHENOTYPES } from "@/lib/halo/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/journal")({
  loader: () => getHaloForecast(),
  component: Journal,
});

function Journal() {
  const data = Route.useLoaderData() as HaloForecast;
  const entries = useJournal((s) => s.entries);
  const add = useJournal((s) => s.add);
  const remove = useJournal((s) => s.remove);
  const learned = useLearned();
  const [date, setDate] = useState(data.today.date);
  const [temple, setTemple] = useState<Intensity>(0);
  const [frontal, setFrontal] = useState<Intensity>(0);
  const [ocular, setOcular] = useState<Intensity>(0);
  const [occipital, setOccipital] = useState<Intensity>(0);
  const [sleep, setSleep] = useState<Intensity>(0);
  const [notes, setNotes] = useState("");

  const day = data.days.find((d) => d.date === date) ?? data.today;
  const snapshot = useMemo(() => {
    const out: Partial<Record<FactorId, number>> = {};
    for (const f of day.factors) out[f.id] = f.score;
    return out;
  }, [day]);

  const existing = entries.find((e) => e.date === date);

  const setters: Record<PhenotypeId, (v: Intensity) => void> = {
    temple: setTemple,
    frontal: setFrontal,
    ocular: setOcular,
    occipital: setOccipital,
    sleep: setSleep,
  };
  const values: Record<PhenotypeId, Intensity> = {
    temple,
    frontal,
    ocular,
    occipital,
    sleep,
  };

  function applyEntry(
    found:
      | {
          temple: Intensity;
          frontal?: Intensity;
          ocular: Intensity;
          occipital: Intensity;
          sleep?: Intensity;
          notes: string;
        }
      | undefined,
  ) {
    if (found) {
      setTemple(found.temple);
      setFrontal(found.frontal ?? 0);
      setOcular(found.ocular);
      setOccipital(found.occipital);
      setSleep(found.sleep ?? 0);
      setNotes(found.notes);
    } else {
      setTemple(0);
      setFrontal(0);
      setOcular(0);
      setOccipital(0);
      setSleep(0);
      setNotes("");
    }
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-xs uppercase tracking-[0.18em] text-faint">Pilot journal</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">What did the head do?</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Saved on this device, separately for each signed-in account. Guest entries stay in the
          guest journal. Log quiet days as well as attacks — how the forehead felt, and how you
          slept. Frontal pressure is the “sinus” / forehead map. Sleep is scored because a broken
          night can open the next-day migraine.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6"
            onSubmit={(e) => {
              e.preventDefault();
              add({
                date,
                temple,
                frontal,
                ocular,
                occipital,
                sleep,
                notes: notes.trim(),
                factorSnapshot: snapshot,
              });
              toast.success(`Saved ${formatMonthDay(date)}`);
            }}
          >
            <label className="block text-sm font-medium">
              Day
              <select
                className="mt-2 h-11 w-full rounded-lg bg-bg px-3 text-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  applyEntry(entries.find((x) => x.date === e.target.value));
                }}
              >
                {data.days.map((d) => (
                  <option key={d.date} value={d.date}>
                    {d.date}
                    {d.date === data.today.date ? " · today" : ""}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-6 space-y-5">
              {PHENOTYPES.map((id) => (
                <IntensityRow key={id} id={id} value={values[id]} onChange={setters[id]} />
              ))}
            </div>

            <label className="mt-6 block text-sm font-medium">
              Notes
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-lg bg-bg px-3 py-2 text-sm text-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]"
                placeholder="Sleep, meals, screen time, smoke in the air, what it felt like…"
              />
            </label>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button type="submit">{existing ? "Update this day" : "Save this day"}</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  applyEntry(undefined);
                  add({
                    date,
                    temple: 0,
                    frontal: 0,
                    ocular: 0,
                    occipital: 0,
                    sleep: 0,
                    notes: "",
                    factorSnapshot: snapshot,
                  });
                  toast.success("Logged a quiet day");
                }}
              >
                Quiet day
              </Button>
            </div>
          </form>

          <aside className="space-y-4">
            <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
              <h2 className="font-display text-2xl">Learning</h2>
              {!learned.ready ? (
                <p className="mt-2 text-sm text-muted">
                  {entries.length}/4 days logged. After four days with attached weather, Halo starts
                  lifting weights that were high on your attack or poor-sleep days.
                </p>
              ) : learned.insights.length === 0 ? (
                <p className="mt-2 text-sm text-muted">
                  Not enough contrast yet. Keep logging both flare and quiet days.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {learned.insights.map((i) => (
                    <li key={`${i.phenotype}-${i.factor}`} className="text-sm">
                      <span className="font-medium">{PHENOTYPE_META[i.phenotype].label}</span>
                      <span className="text-muted">
                        {" "}
                        {i.lift > 0 ? "rises with" : "falls with"}{" "}
                      </span>
                      <span className="font-medium">{FACTOR_META[i.factor].label}</span>
                      <span className="text-faint"> · n={i.sample}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
              <h2 className="font-display text-2xl">On this device</h2>
              {entries.length === 0 ? (
                <p className="mt-2 text-sm text-muted">No days yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-border">
                  {entries
                    .slice()
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .slice(0, 12)
                    .map((e) => (
                      <li
                        key={e.id}
                        className="flex items-center justify-between gap-3 py-2.5 text-sm"
                      >
                        <div>
                          <p className="font-medium">{formatMonthDay(e.date)}</p>
                          <p className="text-faint">
                            T{e.temple} · F{e.frontal ?? 0} · E{e.ocular} · N{e.occipital} · S
                            {e.sleep ?? 0}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-muted underline-offset-4 hover:underline"
                          onClick={() => remove(e.id)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </section>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}

function IntensityRow({
  id,
  value,
  onChange,
}: {
  id: PhenotypeId;
  value: Intensity;
  onChange: (v: Intensity) => void;
}) {
  const labels = id === "sleep" ? SLEEP_LABEL : INTENSITY_LABEL;
  return (
    <fieldset>
      <legend className="text-sm font-medium">{PHENOTYPE_META[id].label}</legend>
      <p className="mt-0.5 text-xs text-faint">{PHENOTYPE_META[id].feel}</p>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {([0, 1, 2, 3] as Intensity[]).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              "h-11 rounded-lg text-xs font-medium",
              value === n ? "bg-primary text-primary-fg" : "bg-bg text-muted",
            )}
          >
            {labels[n]}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
