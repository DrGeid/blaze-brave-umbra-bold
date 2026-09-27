import { useMemo } from "react";
import { createFileRoute, redirect, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clinicBriefing } from "@/lib/halo/briefing";
import { EVIDENCE_COPY, FACTOR_META, PHENOTYPE_META } from "@/lib/halo/constants";
import { getClinicForecast } from "@/lib/clinic-access";
import { bandLabel, formatLongDate } from "@/lib/halo/format";
import type { HaloForecast } from "@/lib/halo/types";
import { PHENOTYPES } from "@/lib/halo/types";

export const Route = createFileRoute("/clinic")({
  beforeLoad: ({ context }) => {
    if (!context.accountAccess.userId) throw redirect({ to: "/login" });
    if (!context.accountAccess.canAccessClinic) throw notFound();
  },
  loader: () => getClinicForecast(),
  component: Clinic,
});

function Clinic() {
  const data = Route.useLoaderData() as HaloForecast;
  const day = data.today;
  const text = useMemo(() => clinicBriefing(day), [day]);

  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-xs uppercase tracking-[0.18em] text-faint">Clinician desk</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Halton briefing</h1>
        <p className="mt-3 max-w-2xl text-muted">
          One regional score for Oakville and Burlington. Five phenotypes — temple, frontal, ocular,
          occipital, and sleep disruption. Use this as a weather and air-quality context layer, not
          a diagnosis. This desk is restricted to the owner account; journals remain private to each
          account on its device.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)] sm:p-8">
            <p className="text-xs uppercase tracking-[0.16em] text-faint">
              {formatLongDate(day.date)}
            </p>
            <h2 className="mt-2 font-display text-3xl">Today in clinic</h2>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-center sm:grid-cols-3 lg:grid-cols-5">
              {PHENOTYPES.map((id) => (
                <div key={id} className="rounded-lg bg-bg px-2 py-4">
                  <dt className="text-xs uppercase tracking-wider text-faint">
                    {PHENOTYPE_META[id].label}
                  </dt>
                  <dd className="mt-1 font-display text-3xl tabular-nums">
                    {day.phenotypes[id].score}
                  </dd>
                  <dd className="mt-1">
                    <Badge tone={day.phenotypes[id].band}>
                      {bandLabel(day.phenotypes[id].band)}
                    </Badge>
                  </dd>
                </div>
              ))}
            </dl>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted">
              <li>
                Facial pressure that patients call sinus is, with ordinary weather swings, more
                often migraine than true barosinusitis.
              </li>
              <li>
                Temple-predominant days track a vice at the sides. Frontal days track forehead /
                “sinus” pressure with falling barometer, humidity, and pollen — more often migraine
                than sinus infection. Ocular days track glare, humidity, and pressure behind the
                eyes. Occipital days track wind, fronts, and temperature. Sleep days track heat,
                storms, and air quality — and a broken night can open the next-day attack.
              </li>
              <li>
                Ask what they feel, and how they slept, not only “migraine yes/no.” The journal on
                this device can later re-weight factors per person.
              </li>
            </ul>
            <Button
              className="mt-6"
              onClick={async () => {
                await navigator.clipboard.writeText(text);
                toast.success("Briefing copied");
              }}
            >
              Copy talking points
            </Button>
          </article>

          <aside className="rounded-xl bg-primary px-6 py-6 text-primary-fg">
            <p className="text-xs uppercase tracking-[0.16em] opacity-70">How to counsel</p>
            <h2 className="mt-2 font-display text-2xl">A 90-second script</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-4 text-sm leading-relaxed opacity-90">
              <li>
                Name the day: “The Halton air looks {bandLabel(day.band).toLowerCase()} for
                weather-sensitive heads.”
              </li>
              <li>
                Separate sinus infection from weather-migraine so they skip unneeded antibiotics.
              </li>
              <li>
                Protect sleep, fluids, meals. Treat early if this is a known pattern. Smoke and
                ragweed days are real Ontario signals.
              </li>
              <li>
                Do not over-promise on moon, tide, flare, or Mercury. Offer the journal if they want
                proof for themselves.
              </li>
            </ol>
          </aside>
        </div>

        <section className="mt-8 overflow-x-auto rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6">
          <h2 className="font-display text-2xl">Evidence grades we ship</h2>
          <table className="mt-4 w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-faint">
                <th className="pb-2 font-medium">Factor</th>
                <th className="pb-2 font-medium">Grade</th>
                <th className="pb-2 font-medium">Today</th>
                <th className="pb-2 font-medium">Use in room</th>
              </tr>
            </thead>
            <tbody>
              {day.factors
                .slice()
                .sort((a, b) => b.score - a.score)
                .map((f) => (
                  <tr key={f.id} className="border-t border-border">
                    <td className="py-2.5">{FACTOR_META[f.id].label}</td>
                    <td className="py-2.5">
                      <Badge tone={f.evidence}>{EVIDENCE_COPY[f.evidence]}</Badge>
                    </td>
                    <td className="py-2.5 tabular-nums">{f.score}</td>
                    <td className="py-2.5 text-muted">{f.observed}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>

        <pre className="mt-8 overflow-x-auto whitespace-pre-wrap rounded-xl bg-fg px-5 py-5 font-sans text-sm leading-relaxed text-primary-fg">
          {text}
        </pre>
      </main>
    </AppShell>
  );
}
