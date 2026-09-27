import { FACTOR_META, LOAD_MAX, PHENOTYPE_META } from "./constants";
import { bandLabel, formatLongDate } from "./format";
import type { DayResult } from "./types";
import { PHENOTYPES } from "./types";

export function clinicBriefing(day: DayResult): string {
  const p = day.phenotypes;
  const topFactors = [...day.factors].sort((a, b) => b.score - a.score).slice(0, 5);
  const lead = PHENOTYPES.map((id) => p[id]).sort((a, b) => b.score - a.score)[0];

  return [
    `Halo · Halton briefing · ${formatLongDate(day.date)}`,
    `Oakville & Burlington (one regional score)`,
    ``,
    `Opportunity ${day.opportunity}/100 · ${bandLabel(day.band)} · load ${day.load}/${LOAD_MAX}`,
    `Temple ${p.temple.score} · Frontal ${p.frontal.score} · Ocular ${p.ocular.score} · Occipital ${p.occipital.score} · Sleep ${p.sleep.score}`,
    ``,
    `Lead phenotype: ${PHENOTYPE_META[lead.id].label} (${lead.score}).`,
    `Lead terms: ${topFactors.map((f) => `${FACTOR_META[f.id].label} ${f.score}`).join("; ")}.`,
    ``,
    `Talking points`,
    `• ${PHENOTYPE_META[lead.id].detail}`,
    `• Barometric change is the strongest published weather signal (falls of ~6–10 hPa, or absolute pressure near 1003–1007 hPa).`,
    `• Wildfire PM2.5 has an Ontario ED signal. Pollen here is a southern-Ontario phenology model (ragweed now).`,
    `• Facial “sinus” / forehead pressure is scored as frontal — more often migraine than sinus infection.`,
    `• Sleep disruption is scored separately because a broken night lowers the next-day threshold.`,
    `• Moon, spring tide, Kp, flare, eclipse, and Mercury stay low-weight until a personal journal says otherwise.`,
    `• Plan sleep, hydration, and early treatment if this is a known weather-sensitive patient.`,
    ``,
    `Not a diagnosis. Seek emergency care for sudden worst-ever headache, deficit, or thunderclap onset.`,
  ].join("\n");
}

export function nowcastCopy(day: DayResult): string {
  const w = day.weather;
  const bits = [
    w.pressureMean != null ? `${w.pressureMean.toFixed(0)} hPa` : null,
    w.pressureDrop24h >= 1 ? `down ${w.pressureDrop24h.toFixed(1)} in 24h` : null,
    w.humidityMean != null ? `${Math.round(w.humidityMean)}% humidity` : null,
    w.precipSum && w.precipSum > 0.2 ? `${w.precipSum.toFixed(1)} mm rain` : null,
    w.pm25 != null ? `PM2.5 ${w.pm25.toFixed(0)}` : null,
    w.pollenIndex >= 20 ? w.pollenLabel : null,
    `Kp ${day.sky.kpMax.toFixed(1)} ${day.sky.kpLabel}`,
    day.sky.flareClass !== "None" ? `Flare ${day.sky.flareClass}` : null,
    day.sky.moonName,
  ].filter(Boolean);
  return bits.join(" · ");
}
