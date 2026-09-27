import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { EVIDENCE_COPY, FACTOR_META, LOAD_MAX } from "@/lib/halo/constants";
import type { FactorId } from "@/lib/halo/types";
import { FACTOR_IDS } from "@/lib/halo/types";

export const Route = createFileRoute("/science")({
  component: Science,
});

const NOTES: Record<FactorId, string> = {
  pressure_drop:
    "The most consistent weather signal. Okuma et al. (2015) found attacks clustering when pressure sat 6–10 hPa below 1013, especially on the way down. Mayo Clinic lists barometric change as a trigger. Halo scores both 24-hour mean drop and the steepest 6-hour slide (an arriving front).",
  low_pressure:
    "Absolute low pressure, not only the change. The 1003–1007 hPa band was over-represented in the Okuma migraine diaries versus tension-type headache.",
  humidity:
    "Mayo and Migraine Trust list high humidity and very dry air. Mechanisms are indirect (sleep, sinus fullness, dehydration). Mixed in population studies — kept as a moderate term.",
  rain:
    "Rain usually rides with a falling barometer and a front. Thunderstorms stack wind, pressure, and electrical weather. Scored from millimetres plus convective weather codes. Also a sleep-noise term.",
  temp_swing:
    "The migraine brain dislikes change. Large diurnal range and day-to-day mean shifts are both counted. Heat and cold extremes are a separate term.",
  wind_front:
    "Windy, stormy weather is on clinical trigger lists. Combined with a pressure drop it is treated as a frontal passage — especially relevant to occipital/neck guarding and broken sleep.",
  extremes:
    "Hot Halton days (≥29°C), humidex-like heat+humidity, and cold snaps. Indirect via dehydration, sleep, and muscle tone. Night-time heat is a large sleep-disruption weight.",
  glare:
    "Bright sunlight and sun glare are Mayo-listed. Daytime cloud cover is the proxy. Fresh snow (or a snow weather code) adds an albedo bump — a Halton winter signature for the ocular score.",
  pm25:
    "A 2010–2023 Alberta and Ontario case-crossover study (~998,000 headache ED visits) linked wildfire-sourced PM2.5 to about a 6% rise in migraine/primary-headache emergency visits. Stronger than ordinary urban particles. CAMS hourly PM2.5 at the Halton midpoint.",
  air_pollution:
    "An Ontario smartphone series (69,808 attacks) associated higher NO₂ and ozone with new migraine onsets, along with pressure change and winter cold. Scored from CAMS NO₂ and O₃.",
  pollen:
    "CAMS pollen fields are Europe-only, so Halo uses a southern-Ontario phenology curve: trees (April–May), grass (June–July), ragweed (mid-August to early October). Rain washes it down; warmth and wind lift it. Hits ocular strain, temple fullness, and sleep (congestion).",
  geomagnetic:
    "Kp from NOAA SWPC. Kuritzky (1987) reported more intense (not more frequent) headaches during storms. A 2016 social-media study found no broad link. Canada sits nearer the magnetic pole, so the default weight is slightly higher than a mid-latitude US city — still mixed evidence.",
  solar_flare:
    "GOES X-ray class (B/C/M/X) plus NOAA R-scale probabilities. Flares are electromagnetic radiation arriving in about eight minutes. They are not a proven migraine trigger; the later geomagnetic storm is scored separately as Kp. Very low default weight.",
  spring_tide:
    "Moon + Sun gravity alignment (spring vs neap) with a perigee boost. Lake Ontario's astronomical water tide is under 5 cm — this is not Burlington water level. It is the same syzygy window as the moon term, read as gravity rather than illumination. Mixed / hypothesis (including speculative 'biological tide' ideas).",
  moon:
    "Illumination and circadian reading of the lunar cycle, separate from spring tide. A small Turkish retrospective and a National Headache Foundation note suggested more attacks near new moon. Findings conflict.",
  eclipse:
    "No clinical evidence. Patients report odd days around eclipse season. Halo uses a short window around catalogued 2026–2028 eclipses plus a floor during the two-week season. Lowest weather-adjacent weight.",
  mercury:
    "No biomedical evidence. Included because it was requested, at the smallest default weight, so a personal journal can raise it if someone's attacks truly cluster there.",
};

function Science() {
  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-xs uppercase tracking-[0.18em] text-faint">How Halo thinks</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Evidence, then a score</h1>
        <p className="mt-4 text-muted">
          Each factor is scored 0–100 from today's Halton air and sky. Those{" "}
          {FACTOR_IDS.length} numbers are summed as atmospheric load (max{" "}
          {LOAD_MAX.toLocaleString()}). Temple, frontal, ocular, occipital, and
          sleep scores are weighted averages of the same factors — weather and air heavy, sky
          light — until a journal on this device proves a personal pattern.
        </p>
        <p className="mt-3 text-muted">
          About 30–50% of people with migraine name weather as a trigger. That is
          common, not universal. Frontal pressure is the forehead / “sinus” map,
          kept separate from a temple vice. Sleep is scored as disruption risk
          because a broken night is a well-known pathway into an attack. Halo is
          a planning layer, not a cause.
        </p>

        <ol className="mt-10 space-y-8">
          {FACTOR_IDS.map((id, i) => (
            <li key={id}>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-display text-3xl text-faint">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="font-display text-2xl">{FACTOR_META[id].label}</h2>
                <Badge tone={FACTOR_META[id].evidence}>
                  {EVIDENCE_COPY[FACTOR_META[id].evidence]}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{NOTES[id]}</p>
            </li>
          ))}
        </ol>

        <section className="mt-12 rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-2xl">Five scores</h2>
          <p className="mt-2 text-sm text-muted">
            Temple squeeze is a vice at the sides. Frontal pressure is forehead /
            glabella / “sinus” fullness — weather, humidity, and pollen. Ocular
            strain leans on glare (including snow) and pressure behind the eyes.
            Occipital tension leans on wind, fronts, and temperature. Sleep
            disruption leans on heat, storms, wind, smoke, and pollen — and feeds
            the overall opportunity score. Mercury is a rounding error unless you
            teach it otherwise.
          </p>
        </section>
      </main>
    </AppShell>
  );
}
