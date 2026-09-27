import { a as FACTOR_META, c as PHENOTYPES, l as PHENOTYPE_META, s as LOAD_MAX } from "./types-C-WbLUyQ.mjs";
import { n as formatLongDate, t as bandLabel } from "./format-mN0Orl5G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/briefing-Bh_5-0Pa.js
function clinicBriefing(day) {
	const p = day.phenotypes;
	const topFactors = [...day.factors].sort((a, b) => b.score - a.score).slice(0, 5);
	const lead = PHENOTYPES.map((id) => p[id]).sort((a, b) => b.score - a.score)[0];
	return [
		`Halo · Halton briefing · ${formatLongDate(day.date)}`,
		`Oakville & Burlington (one regional score)`,
		``,
		`Opportunity ${day.opportunity}/100 · ${bandLabel(day.band)} · load ${day.load}/${LOAD_MAX}`,
		`Temple ${p.temple.score} · Ocular ${p.ocular.score} · Occipital ${p.occipital.score} · Sleep ${p.sleep.score}`,
		``,
		`Lead phenotype: ${PHENOTYPE_META[lead.id].label} (${lead.score}).`,
		`Lead terms: ${topFactors.map((f) => `${FACTOR_META[f.id].label} ${f.score}`).join("; ")}.`,
		``,
		`Talking points`,
		`• ${PHENOTYPE_META[lead.id].detail}`,
		`• Barometric change is the strongest published weather signal (falls of ~6–10 hPa, or absolute pressure near 1003–1007 hPa).`,
		`• Wildfire PM2.5 has an Ontario ED signal. Pollen here is a southern-Ontario phenology model (ragweed now).`,
		`• Facial “sinus” pressure with weather is more often migraine than sinus infection.`,
		`• Sleep disruption is scored as a fourth phenotype because a broken night lowers the next-day threshold.`,
		`• Moon, spring tide, Kp, flare, eclipse, and Mercury stay low-weight until a personal journal says otherwise.`,
		`• Plan sleep, hydration, and early treatment if this is a known weather-sensitive patient.`,
		``,
		`Not a diagnosis. Seek emergency care for sudden worst-ever headache, deficit, or thunderclap onset.`
	].join("\n");
}
function nowcastCopy(day) {
	const w = day.weather;
	return [
		w.pressureMean != null ? `${w.pressureMean.toFixed(0)} hPa` : null,
		w.pressureDrop24h >= 1 ? `down ${w.pressureDrop24h.toFixed(1)} in 24h` : null,
		w.humidityMean != null ? `${Math.round(w.humidityMean)}% humidity` : null,
		w.precipSum && w.precipSum > .2 ? `${w.precipSum.toFixed(1)} mm rain` : null,
		w.pm25 != null ? `PM2.5 ${w.pm25.toFixed(0)}` : null,
		w.pollenIndex >= 20 ? w.pollenLabel : null,
		`Kp ${day.sky.kpMax.toFixed(1)} ${day.sky.kpLabel}`,
		day.sky.flareClass !== "None" ? `Flare ${day.sky.flareClass}` : null,
		day.sky.moonName
	].filter(Boolean).join(" · ");
}
//#endregion
export { nowcastCopy as n, clinicBriefing as t };
