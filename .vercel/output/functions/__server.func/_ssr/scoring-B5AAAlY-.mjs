import { a as FACTOR_META, c as PHENOTYPES, i as FACTOR_IDS, l as PHENOTYPE_META, s as LOAD_MAX, t as BASE_WEIGHTS } from "./types-C-WbLUyQ.mjs";
import { c as scoreLine, n as clamp, o as round0, s as round1, t as circularDist } from "./math-BwT10IIp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scoring-B5AAAlY-.js
/** Visible or globally notable eclipses 2026–2028. Aug 2026 lunar is visible in North America. */
var ECLIPSES = [
	{
		date: "2026-02-17",
		kind: "solar",
		name: "Annular solar eclipse"
	},
	{
		date: "2026-03-03",
		kind: "lunar",
		name: "Total lunar eclipse"
	},
	{
		date: "2026-08-12",
		kind: "solar",
		name: "Total solar eclipse"
	},
	{
		date: "2026-08-28",
		kind: "lunar",
		name: "Partial lunar eclipse"
	},
	{
		date: "2027-02-06",
		kind: "solar",
		name: "Annular solar eclipse"
	},
	{
		date: "2027-02-20",
		kind: "lunar",
		name: "Penumbral lunar eclipse"
	},
	{
		date: "2027-07-18",
		kind: "lunar",
		name: "Penumbral lunar eclipse"
	},
	{
		date: "2027-08-02",
		kind: "solar",
		name: "Total solar eclipse"
	},
	{
		date: "2027-08-17",
		kind: "lunar",
		name: "Penumbral lunar eclipse"
	},
	{
		date: "2028-01-12",
		kind: "lunar",
		name: "Partial lunar eclipse"
	},
	{
		date: "2028-01-26",
		kind: "solar",
		name: "Annular solar eclipse"
	},
	{
		date: "2028-07-06",
		kind: "lunar",
		name: "Partial lunar eclipse"
	},
	{
		date: "2028-07-21",
		kind: "solar",
		name: "Total solar eclipse"
	}
];
/** Eastern-time calendar dates (Almanac). Shadow = 14 days before start, 7 after end. */
var MERCURY_SPANS = [
	span("2026-02-26", "2026-03-20", "Mercury retrograde in Pisces"),
	span("2026-06-29", "2026-07-23", "Mercury retrograde in Cancer"),
	span("2026-10-24", "2026-11-13", "Mercury retrograde in Scorpio"),
	span("2027-02-09", "2027-03-03", "Mercury retrograde"),
	span("2027-06-10", "2027-07-04", "Mercury retrograde"),
	span("2027-10-07", "2027-10-28", "Mercury retrograde"),
	span("2028-01-24", "2028-02-14", "Mercury retrograde"),
	span("2028-05-21", "2028-06-14", "Mercury retrograde"),
	span("2028-09-19", "2028-10-11", "Mercury retrograde")
];
function span(start, end, label) {
	return {
		start,
		end,
		shadowStart: shiftDate(start, -14),
		shadowEnd: shiftDate(end, 7),
		label
	};
}
function shiftDate(iso, days) {
	const d = /* @__PURE__ */ new Date(`${iso}T12:00:00Z`);
	d.setUTCDate(d.getUTCDate() + days);
	return d.toISOString().slice(0, 10);
}
function daysBetween(a, b) {
	const ms = Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`);
	return Math.round(ms / 864e5);
}
function nearestEclipse(date) {
	let best = null;
	for (const event of ECLIPSES) {
		const daysAway = daysBetween(date, event.date);
		if (!best || Math.abs(daysAway) < Math.abs(best.daysAway)) best = {
			event,
			daysAway
		};
	}
	return best;
}
function inEclipseSeason(date) {
	const sorted = [...ECLIPSES].sort((a, b) => a.date.localeCompare(b.date));
	for (let i = 0; i < sorted.length - 1; i++) {
		const gap = daysBetween(sorted[i].date, sorted[i + 1].date);
		if (gap > 0 && gap <= 20) {
			if (date >= sorted[i].date && date <= sorted[i + 1].date) return true;
		}
	}
	return false;
}
function mercuryState(date) {
	for (const s of MERCURY_SPANS) if (date >= s.start && date <= s.end) return {
		state: "retrograde",
		label: s.label,
		until: s.end
	};
	for (const s of MERCURY_SPANS) {
		if (date >= s.shadowStart && date < s.start) return {
			state: "shadow",
			label: `Pre-shadow · ${s.label}`,
			until: s.start
		};
		if (date > s.end && date <= s.shadowEnd) return {
			state: "shadow",
			label: `Post-shadow · ${s.label}`,
			until: s.shadowEnd
		};
	}
	const next = MERCURY_SPANS.find((s) => s.start > date);
	return {
		state: "direct",
		label: next ? `Direct until ${formatShort(next.start)}` : "Direct",
		until: next?.start
	};
}
function formatShort(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return `${[
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	][m - 1]} ${d}, ${y}`;
}
/** Synodic month from a known new moon (6 Jan 2000 18:14 UTC). */
var SYNODIC = 29.530588853;
var KNOWN_NEW = Date.UTC(2e3, 0, 6, 18, 14, 0);
var J2000 = Date.UTC(2e3, 0, 1, 12, 0, 0);
function moonPhase(dateIso) {
	const days = (Date.parse(`${dateIso}T12:00:00Z`) - KNOWN_NEW) / 864e5;
	return (days / SYNODIC - Math.floor(days / SYNODIC) + 1) % 1;
}
function moonIllumination(phase) {
	return (1 - Math.cos(phase * 2 * Math.PI)) / 2;
}
function moonName(phase) {
	if (phase < .03 || phase >= .97) return "New moon";
	if (phase < .22) return "Waxing crescent";
	if (phase < .28) return "First quarter";
	if (phase < .47) return "Waxing gibbous";
	if (phase < .53) return "Full moon";
	if (phase < .72) return "Waning gibbous";
	if (phase < .78) return "Last quarter";
	return "Waning crescent";
}
/** Mean anomaly in turns; 0 ≈ perigee (Meeus from J2000). */
function lunarAnomalyTurns(dateIso) {
	return ((134.96340251 + 13.0649929509 * ((Date.parse(`${dateIso}T12:00:00Z`) - J2000) / 864e5)) / 360 % 1 + 1) % 1;
}
function perigeeProximity(dateIso) {
	const a = lunarAnomalyTurns(dateIso);
	const dist = Math.min(a, 1 - a);
	return clamp(1 - dist / .18, 0, 1);
}
/** Spring-tide strength 0–1 from syzygy (new/full) plus perigee. Not Lake Ontario water level. */
function springTideStrength(dateIso) {
	const phase = moonPhase(dateIso);
	const dNew = circularDist(phase, 0);
	const dFull = circularDist(phase, .5);
	const spring = clamp(1 - Math.min(dNew, dFull) / .25, 0, 1);
	const perigee = perigeeProximity(dateIso);
	const strength = clamp(.74 * spring + .26 * perigee, 0, 1);
	const which = dNew <= dFull ? "new-moon" : "full-moon";
	let label = "Neap / middling tide";
	if (spring >= .72 && perigee >= .55) label = `Perigean spring tide (${which})`;
	else if (spring >= .72) label = `Spring tide (${which} alignment)`;
	else if (spring >= .35) label = "Building toward spring tide";
	else if (perigee >= .7) label = "Perigee, not spring";
	return {
		strength,
		perigee,
		label
	};
}
function bandFor(score) {
	if (score >= 80) return "peak";
	if (score >= 65) return "high";
	if (score >= 45) return "elevated";
	if (score >= 25) return "watch";
	return "quiet";
}
function buildSky(date, space) {
	const phase = moonPhase(date);
	const nearest = nearestEclipse(date);
	const eclipse = nearest && Math.abs(nearest.daysAway) <= 10 ? {
		name: nearest.event.name,
		date: nearest.event.date,
		daysAway: nearest.daysAway,
		kind: nearest.event.kind
	} : null;
	const tide = springTideStrength(date);
	return {
		moonPhase: phase,
		moonName: moonName(phase),
		moonIllumination: moonIllumination(phase),
		kpMax: space.kpMax,
		kpLabel: kpLabel(space.kpMax),
		eclipse,
		eclipseSeason: inEclipseSeason(date),
		mercury: mercuryState(date),
		springTide: tide.strength,
		perigee: tide.perigee,
		tideLabel: tide.label,
		flareClass: space.flareClass,
		flareScore: space.flareScore,
		rScale: space.rScale,
		rLabel: space.rLabel
	};
}
function kpLabel(kp) {
	if (kp >= 9) return "G5 extreme";
	if (kp >= 8) return "G4 severe";
	if (kp >= 7) return "G3 strong";
	if (kp >= 6) return "G2 moderate";
	if (kp >= 5) return "G1 minor";
	if (kp >= 4) return "Active";
	if (kp >= 3) return "Unsettled";
	return "Quiet";
}
function scorePressureDrop(drop24, drop6) {
	const drop = Math.max(drop24, drop6);
	return pack("pressure_drop", scoreLine(drop, [
		[-8, 35],
		[-4, 18],
		[0, 6],
		[3, 28],
		[6, 68],
		[8, 86],
		[12, 100]
	]), drop6 >= drop24 + 1.5 ? `${round1(drop6)} hPa in 6 h` : `${round1(drop24)} hPa over 24 h`, drop >= 6 ? "Falls of about 6–10 hPa are the range most often tied to migraine in clinical series." : drop > 0 ? "A modest decline. Some weather-sensitive people notice even small slides." : "Pressure is steady or rising.");
}
function scoreLowPressure(meanP, minP) {
	const p = minP ?? meanP ?? 1013;
	return pack("low_pressure", scoreLine(p, [
		[995, 100],
		[1003, 88],
		[1005, 74],
		[1007, 58],
		[1013, 10],
		[1024, 8],
		[1032, 18]
	]), `${round1(p)} hPa`, p <= 1007 ? "Near or below 1003–1007 hPa, the band where Okuma et al. saw the most attacks." : "Close to standard sea-level pressure (1013 hPa).");
}
function scoreHumidity(h) {
	const v = h ?? 50;
	const high = scoreLine(v, [
		[40, 8],
		[55, 14],
		[70, 42],
		[80, 70],
		[92, 92]
	]);
	const dry = v < 28 ? scoreLine(v, [[10, 70], [28, 20]]) : 0;
	return pack("humidity", Math.max(high, dry), `${round0(v)}%`, v >= 70 ? "Moist air is a commonly reported trigger and can add a sinus-like fullness." : v < 28 ? "Very dry air is also on clinical trigger lists." : "Humidity is in a middling band.");
}
function scoreRain(mm, code) {
	const precip = mm ?? 0;
	let score = scoreLine(precip, [
		[0, 0],
		[.4, 18],
		[2, 42],
		[6, 68],
		[15, 88],
		[30, 100]
	]);
	const thunder = (code ?? 0) >= 95;
	if (thunder) score = Math.max(score, 86);
	return pack("rain", score, thunder ? `${round1(precip)} mm · thunder` : `${round1(precip)} mm`, thunder ? "Storms combine rain, pressure change, and wind — a stacked weather load." : precip > 0 ? "Wet weather often travels with a falling barometer." : "No rain in the daily total.");
}
function scoreTempSwing(maxT, minT, prevMean, meanT) {
	const range = maxT != null && minT != null ? maxT - minT : 0;
	const dayChange = prevMean != null && meanT != null ? Math.abs(meanT - prevMean) : 0;
	const rangeScore = scoreLine(range, [
		[6, 10],
		[10, 32],
		[14, 58],
		[18, 84],
		[22, 100]
	]);
	const changeScore = scoreLine(dayChange, [
		[3, 8],
		[6, 40],
		[10, 75],
		[14, 95]
	]);
	return pack("temp_swing", clamp(.7 * rangeScore + .3 * changeScore, 0, 100), `${round1(range)}°C range`, dayChange >= 6 ? `Also a ${round1(dayChange)}°C shift from yesterday's mean.` : "The migraine brain dislikes abrupt thermal change.");
}
function scoreWind(wind, gust, drop) {
	const w = Math.max(wind ?? 0, (gust ?? 0) * .75);
	let score = scoreLine(w, [
		[12, 6],
		[25, 32],
		[40, 62],
		[55, 84],
		[75, 100]
	]);
	if (drop >= 4 && w >= 20) score = clamp(score * 1.18, 0, 100);
	return pack("wind_front", score, gust && gust > (wind ?? 0) ? `${round0(wind ?? 0)} km/h, gusts ${round0(gust)}` : `${round0(w)} km/h`, drop >= 4 && w >= 20 ? "Wind plus a falling barometer — a classic frontal passage." : "Breezy days can add neck and scalp muscle load.");
}
function scoreExtremes(maxT, minT, humidity) {
	const hot = maxT ?? 15;
	const cold = minT ?? 15;
	const heat = hot >= 26 ? scoreLine(hot, [
		[26, 10],
		[29, 48],
		[32, 78],
		[35, 100]
	]) : 0;
	const chill = cold <= 5 ? scoreLine(-cold, [
		[-5, 12],
		[0, 35],
		[8, 70],
		[18, 95]
	]) : 0;
	let score = Math.max(heat, chill);
	if (hot >= 26 && (humidity ?? 0) >= 70) score = clamp(score + 12, 0, 100);
	return pack("extremes", score, `${round1(minT ?? 0)}–${round1(maxT ?? 0)}°C`, hot >= 29 ? "Heat (and humidex) can dehydrate and lower the attack threshold." : cold <= 0 ? "Cold snaps add occipital and trapezius guarding." : "Temperatures are within a typical Halton band.");
}
function isSnowCode(code) {
	const c = code ?? -1;
	return c >= 71 && c <= 77 || c === 85 || c === 86 || c === 87;
}
function scoreGlare(w) {
	const cloud = w.cloudDay ?? 60;
	let score = scoreLine(100 - cloud, [
		[20, 8],
		[50, 36],
		[70, 62],
		[90, 86]
	]);
	if ((w.precipSum ?? 0) > 1 && cloud < 50) score = clamp(score + 14, 0, 100);
	if ((w.weatherCodeMax ?? 0) === 0 && cloud < 25) score = Math.max(score, 70);
	const snow = (w.snowfallSum ?? 0) > .15 || isSnowCode(w.weatherCodeMax);
	const cold = (w.tempMin ?? 10) <= 1;
	let extra = "";
	if (snow && cloud < 78) {
		const albedo = scoreLine(100 - cloud, [
			[15, 14],
			[45, 32],
			[80, 50]
		]);
		score = clamp(score + albedo, 0, 100);
		extra = " · snow glare";
	} else if (cold && cloud < 35) {
		score = clamp(score + 8, 0, 100);
		extra = " · winter light";
	}
	return pack("glare", score, `${round0(cloud)}% daytime cloud${extra}`, snow ? "Fresh snow reflects sunlight and can double photophobia load — a Halton winter signature." : cloud < 40 ? "Bright, low-cloud skies raise glare and photophobia load." : "A covered sky usually eases glare, though fluorescent indoor light still counts.");
}
function scorePm25(pm) {
	const v = pm ?? 0;
	return pack("pm25", scoreLine(v, [
		[5, 4],
		[12, 18],
		[15, 32],
		[27, 58],
		[50, 80],
		[90, 96],
		[140, 100]
	]), v > 0 ? `${round1(v)} µg/m³` : "No reading", v >= 27 ? "Above Canada's 24-hour PM2.5 guideline. Ontario ED data link wildfire smoke to more migraine visits." : v >= 12 ? "Elevated fine particles. Smoke days hit harder than ordinary urban PM." : "Fine-particle load is modest.");
}
function scoreAirPollution(no2, o3) {
	const n = no2 ?? 0;
	const o = o3 ?? 0;
	const nScore = scoreLine(n, [
		[10, 4],
		[25, 22],
		[40, 48],
		[80, 78],
		[140, 96]
	]);
	const oScore = scoreLine(o, [
		[70, 6],
		[100, 28],
		[140, 62],
		[180, 86],
		[220, 100]
	]);
	return pack("air_pollution", clamp(Math.max(nScore, oScore) + .18 * Math.min(nScore, oScore), 0, 100), `NO₂ ${round0(n)} · O₃ ${round0(o)} µg/m³`, oScore >= nScore ? "An Ontario attack-diary study tied ozone (and NO₂) to new migraine onsets." : "Nitrogen dioxide tracks traffic. Same Ontario series found higher odds after elevated NO₂.");
}
function scorePollen(index, label) {
	return pack("pollen", index, label, index >= 45 ? "Southern Ontario ragweed (late Aug–Sep) and spring trees can add ocular and sinus-like load, and fragment sleep." : "Pollen is a seasonal Halton term. CAMS does not publish North American counts, so this is a phenology model.");
}
function scoreGeomagnetic(kp) {
	return pack("geomagnetic", scoreLine(kp, [
		[1, 4],
		[3, 16],
		[4, 32],
		[5, 52],
		[6, 70],
		[7, 86],
		[9, 100]
	]), `Kp ${round1(kp)}`, kp >= 5 ? "Storm levels. Canada sits closer to the magnetic pole; evidence is still mixed for migraine." : "Field is quiet to unsettled. This term stays low-weight unless your journal disagrees.");
}
function scoreSolarFlare(sky) {
	const observed = sky.flareClass !== "None" ? `GOES ${sky.flareClass} · ${sky.rLabel}` : sky.rLabel;
	const note = sky.flareScore >= 50 ? "X-rays arrive in minutes (R-scale). The later geomagnetic storm is scored separately as Kp. Default weight is very low." : "No biomedical proof that flare X-rays trigger migraine. Kept so the journal can learn.";
	return pack("solar_flare", sky.flareScore, observed, note);
}
function scoreSpringTide(sky) {
	return pack("spring_tide", sky.springTide * 100, sky.tideLabel, "Lake Ontario's water tide is only ~5 cm. This scores Earth/luni-solar alignment (spring vs neap, plus perigee) — not Burlington water level.");
}
function scoreMoon(phase, name) {
	const dNew = circularDist(phase, 0);
	const dFull = circularDist(phase, .5);
	const nearest = Math.min(dNew, dFull * 1.08);
	let score = clamp(100 * (1 - nearest / .16), 0, 100);
	if (dNew < dFull) score = clamp(score * 1.05, 0, 100);
	return pack("moon", score, `${name} (${round0(moonIllumination(phase) * 100)}% lit)`, "Illumination / circadian reading of the lunar cycle, separate from the gravity (spring-tide) term. Evidence is mixed.");
}
function scoreEclipse(sky) {
	let score = 0;
	let observed = "No eclipse nearby";
	let note = "No biomedical evidence that eclipses trigger migraine. Included at a very low weight because patients asked.";
	if (sky.eclipse) {
		const d = Math.abs(sky.eclipse.daysAway);
		score = scoreLine(d, [
			[0, 100],
			[1, 78],
			[2, 52],
			[4, 24],
			[6, 8],
			[8, 0]
		]);
		observed = sky.eclipse.daysAway === 0 ? sky.eclipse.name : sky.eclipse.daysAway > 0 ? `${sky.eclipse.name} in ${sky.eclipse.daysAway}d` : `${sky.eclipse.name} ${-sky.eclipse.daysAway}d ago`;
	}
	if (sky.eclipseSeason) {
		score = Math.max(score, 22);
		observed = observed === "No eclipse nearby" ? "Eclipse season" : `${observed} · season`;
		note = "You are between the August 2026 solar and lunar eclipses. Weight stays low until a journal shows a personal pattern.";
	}
	return pack("eclipse", score, observed, note);
}
function scoreMercury(sky) {
	return pack("mercury", sky.mercury.state === "retrograde" ? 38 : sky.mercury.state === "shadow" ? 16 : 0, sky.mercury.label, "No scientific evidence links Mercury retrograde to migraine. Lowest default weight; the journal can raise it if your days cluster here.");
}
function pack(id, score, observed, note) {
	return {
		id,
		score: clamp(round0(score), 0, 100),
		evidence: FACTOR_META[id].evidence,
		observed,
		note
	};
}
function scoreFactors(weather, sky, prevMeanTemp) {
	const drop = Math.max(weather.pressureDrop24h, weather.pressureDrop6h);
	return [
		scorePressureDrop(weather.pressureDrop24h, weather.pressureDrop6h),
		scoreLowPressure(weather.pressureMean, weather.pressureMin),
		scoreHumidity(weather.humidityMean),
		scoreRain(weather.precipSum, weather.weatherCodeMax),
		scoreTempSwing(weather.tempMax, weather.tempMin, prevMeanTemp, weather.tempMean),
		scoreWind(weather.windMax, weather.gustMax, drop),
		scoreExtremes(weather.tempMax, weather.tempMin, weather.humidityMean),
		scoreGlare(weather),
		scorePm25(weather.pm25),
		scoreAirPollution(weather.no2, weather.o3),
		scorePollen(weather.pollenIndex, weather.pollenLabel),
		scoreGeomagnetic(sky.kpMax),
		scoreSolarFlare(sky),
		scoreSpringTide(sky),
		scoreMoon(sky.moonPhase, sky.moonName),
		scoreEclipse(sky),
		scoreMercury(sky)
	];
}
function scorePhenotypes(factors, weights = BASE_WEIGHTS) {
	const byId = Object.fromEntries(factors.map((f) => [f.id, f.score]));
	const out = {};
	for (const id of PHENOTYPES) {
		const w = weights[id];
		const contributions = FACTOR_IDS.map((fid) => ({
			id: fid,
			weight: w[fid],
			points: (byId[fid] ?? 0) * w[fid]
		}));
		const denom = contributions.reduce((a, c) => a + c.weight, 0) || 1;
		const score = clamp(contributions.reduce((a, c) => a + c.points, 0) / denom, 0, 100);
		out[id] = {
			id,
			score: round0(score),
			band: bandFor(score),
			contributions: contributions.map((c) => ({
				...c,
				points: round1(c.points / denom)
			})).sort((a, b) => b.points - a.points)
		};
	}
	return out;
}
function buildDayResult(weather, sky, prevMeanTemp, weights = BASE_WEIGHTS) {
	const factors = scoreFactors(weather, sky, prevMeanTemp);
	const phenotypes = scorePhenotypes(factors, weights);
	const load = factors.reduce((a, f) => a + f.score, 0);
	const migraineScores = PHENOTYPES.filter((p) => p !== "sleep").map((p) => phenotypes[p].score);
	const meanM = migraineScores.reduce((a, b) => a + b, 0) / migraineScores.length;
	const sleep = phenotypes.sleep.score;
	const opportunity = round0(clamp(.48 * Math.max(...migraineScores) + .32 * meanM + .2 * sleep, 0, 100));
	const lead = PHENOTYPES.map((p) => phenotypes[p]).sort((a, b) => b.score - a.score)[0];
	const topFactor = [...factors].sort((a, b) => b.score - a.score)[0];
	return {
		date: weather.date,
		weather,
		sky,
		factors,
		phenotypes,
		load: round0(load),
		loadMax: LOAD_MAX,
		opportunity,
		band: bandFor(opportunity),
		headline: headlineFor(lead.id, lead.score, topFactor)
	};
}
function headlineFor(lead, score, top) {
	const feel = PHENOTYPE_META[lead].label.toLowerCase();
	const driver = FACTOR_META[top.id].label;
	if (score < 25) return `Quiet air for ${feel}. ${driver} is still the loudest factor.`;
	if (score < 45) return `A watch day for ${feel} — driven by ${FACTOR_META[top.id].short.toLowerCase()}.`;
	if (score < 65) return `Elevated ${feel} load. ${driver} is the main driver.`;
	if (score < 80) return `High opportunity for ${feel}. ${driver} is stacked.`;
	return `Peak ${feel} window. ${driver} is doing most of the work.`;
}
//#endregion
export { buildSky as n, buildDayResult as t };
