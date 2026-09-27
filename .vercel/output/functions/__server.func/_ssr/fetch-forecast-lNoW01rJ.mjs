import { n as DISCLAIMER, o as HALTON } from "./types-C-WbLUyQ.mjs";
import { r as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { a as minNum, i as mean, l as sum, n as clamp, o as round0, r as maxNum } from "./math-BwT10IIp.mjs";
import { n as buildSky, t as buildDayResult } from "./scoring-B5AAAlY-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fetch-forecast-lNoW01rJ.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/** Southern Ontario phenology (tree → grass → ragweed). CAMS pollen is Europe-only. */
function seasonalPollen(date, tempMean, precip, wind) {
	const parts = date.split("-").map(Number);
	const doy = dayOfYear(parts[1] ?? 1, parts[2] ?? 1);
	const tree = bump(doy, 85, 112, 145);
	const grass = bump(doy, 140, 166, 208);
	const ragweed = bump(doy, 218, 236, 282);
	const raw = Math.max(tree, grass, ragweed);
	let kind = "Off season";
	if (ragweed >= grass && ragweed >= tree && ragweed > 8) kind = "Ragweed";
	else if (grass >= tree && grass > 8) kind = "Grass";
	else if (tree > 8) kind = "Tree";
	const t = tempMean ?? 12;
	const tempMod = t < 4 ? .12 : t < 10 ? .45 : t < 16 ? .75 : t > 33 ? .7 : 1;
	const rain = precip ?? 0;
	const rainMod = rain >= 10 ? .22 : rain >= 3 ? .5 : rain >= .8 ? .78 : 1;
	const w = wind ?? 10;
	const windMod = w < 4 ? .7 : w < 12 ? 1 : w < 28 ? 1.12 : 1.05;
	const index = clamp(raw * tempMod * rainMod * windMod, 0, 100);
	if (index < 6) return {
		index: round0(index),
		label: "Low / off season"
	};
	return {
		index: round0(index),
		label: `${kind} · ${round0(index)}/100`
	};
}
function dayOfYear(month, day) {
	const md = [
		0,
		31,
		28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	];
	let n = day;
	for (let i = 1; i < month; i++) n += md[i];
	return n;
}
function bump(x, start, peak, end) {
	if (x <= start || x >= end) return 0;
	if (x <= peak) return 100 * ((x - start) / Math.max(1, peak - start));
	return 100 * ((end - x) / Math.max(1, end - peak));
}
function hourlyToDays(hourly) {
	const groups = /* @__PURE__ */ new Map();
	for (const h of hourly) {
		const date = h.time.slice(0, 10);
		const list = groups.get(date) ?? [];
		list.push(h);
		groups.set(date, list);
	}
	const dates = [...groups.keys()].sort();
	const days = [];
	for (let i = 0; i < dates.length; i++) {
		const date = dates[i];
		const hours = groups.get(date) ?? [];
		const prev = i > 0 ? groups.get(dates[i - 1]) ?? [] : [];
		const pressures = hours.map((h) => h.pressure);
		const prevPressures = prev.map((h) => h.pressure);
		const meanP = mean(pressures);
		const drop24 = (mean(prevPressures) ?? meanP ?? 1013) - (meanP ?? 1013);
		const tempMean = mean(hours.map((h) => h.temperature));
		const precipSum = sum(hours.map((h) => h.precipitation));
		const windMax = maxNum(hours.map((h) => h.wind));
		const pollen = seasonalPollen(date, tempMean, precipSum, windMax);
		days.push({
			date,
			tempMax: maxNum(hours.map((h) => h.temperature)),
			tempMin: minNum(hours.map((h) => h.temperature)),
			tempMean,
			humidityMean: mean(hours.map((h) => h.humidity)),
			precipSum,
			snowfallSum: sum(hours.map((h) => h.snowfall)),
			pressureMean: meanP,
			pressureMin: minNum(pressures),
			pressureDrop24h: drop24,
			pressureDrop6h: maxSlidingDrop(pressures, 6),
			windMax,
			gustMax: maxNum(hours.map((h) => h.gust)),
			cloudDay: daytimeCloud(hours),
			weatherCodeMax: maxNum(hours.map((h) => h.weatherCode)),
			pm25: null,
			no2: null,
			o3: null,
			pollenIndex: pollen.index,
			pollenLabel: pollen.label
		});
	}
	return days;
}
function maxSlidingDrop(values, window) {
	const xs = values.map((v) => typeof v === "number" ? v : null);
	let best = 0;
	for (let i = 0; i < xs.length; i++) {
		const a = xs[i];
		if (a == null) continue;
		for (let j = i + 1; j <= i + window && j < xs.length; j++) {
			const b = xs[j];
			if (b == null) continue;
			best = Math.max(best, a - b);
		}
	}
	return best;
}
function daytimeCloud(hours) {
	const day = hours.filter((h) => {
		const hour = Number(h.time.slice(11, 13));
		return hour >= 10 && hour <= 16;
	});
	return mean((day.length ? day : hours).map((h) => h.cloud));
}
function flareScoreFromClass(maxClass) {
	const m = maxClass.trim().toUpperCase().match(/^([ABCMX])(\d+(?:\.\d+)?)/);
	if (!m) return 0;
	const letter = m[1];
	const n = Math.min(Number(m[2]), 20);
	return clamp(({
		A: 2,
		B: 10,
		C: 28,
		M: 58,
		X: 84
	}[letter] ?? 0) + n / 9 * ({
		A: 8,
		B: 16,
		C: 28,
		M: 24,
		X: 16
	}[letter] ?? 0), 0, 100);
}
function bestFlare(events) {
	let best = {
		maxClass: "None",
		score: 0
	};
	for (const e of events) {
		const score = flareScoreFromClass(e.maxClass);
		if (score > best.score) best = {
			maxClass: e.maxClass,
			score
		};
	}
	return best;
}
/** R-scale (radio blackout) is the flare footprint on Earth. */
function rForecastScore(opts) {
	const scale = opts.scale ?? 0;
	const scaleScore = [
		0,
		38,
		58,
		78,
		90,
		100
	][clamp(round0(scale), 0, 5)] ?? 0;
	const minor = opts.minorProb ?? 0;
	const major = opts.majorProb ?? 0;
	const probScore = clamp(minor * .42 + major * .85, 0, 100);
	return {
		score: Math.max(scaleScore, probScore),
		rScale: scale > 0 ? scale : major >= 20 ? 3 : minor >= 40 ? 1 : 0,
		label: scale >= 1 ? `R${scale} radio blackout` : major >= 10 ? `M/X flare odds ${round0(major)}%` : minor >= 15 ? `C-class odds ${round0(minor)}%` : "No significant flare"
	};
}
var CACHE_MS = 6e5;
var cache = null;
var getHaloForecast_createServerFn_handler = createServerRpc({
	id: "227a2003813e6d09e7408632186e77b21c409926e28b77a484a6ac5ba9619134",
	name: "getHaloForecast",
	filename: "src/lib/halo/fetch-forecast.ts"
}, (opts) => getHaloForecast.__executeServer(opts));
var getHaloForecast = createServerFn({ method: "GET" }).handler(getHaloForecast_createServerFn_handler, async () => {
	if (cache && Date.now() - cache.at < CACHE_MS) return cache.data;
	const data = await loadForecast();
	cache = {
		at: Date.now(),
		data
	};
	return data;
});
async function loadForecast() {
	const [weather, kp, air, space] = await Promise.all([
		loadWeather(),
		loadKp(),
		loadAirQuality(),
		loadSpaceWeather()
	]);
	const { hourly, source } = weather;
	const daysWeather = hourlyToDays(hourly).map((d) => mergeAir(d, air.get(d.date)));
	const todayIso = todayInToronto();
	const results = daysWeather.map((w, i) => {
		const sky = buildSky(w.date, spaceForDate(w.date, kp, space));
		const prevMean = i > 0 ? daysWeather[i - 1].tempMean : null;
		return buildDayResult(w, sky, prevMean);
	});
	const today = results.find((d) => d.date === todayIso) ?? results.find((d) => d.date > todayIso) ?? results[Math.min(2, results.length - 1)];
	const forecastDays = results.filter((d) => d.date >= today.date).slice(0, 7);
	const extras = [
		air.size ? "CAMS PM2.5/NO₂/O₃" : null,
		"NOAA GOES X-ray",
		"Halton pollen phenology"
	].filter(Boolean).join(" · ");
	return {
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		location: {
			name: HALTON.name,
			region: HALTON.region,
			lat: HALTON.lat,
			lon: HALTON.lon
		},
		source: `${source} · ${extras}`,
		today,
		days: forecastDays,
		hourly,
		disclaimer: DISCLAIMER
	};
}
function mergeAir(day, air) {
	if (!air) return day;
	return {
		...day,
		pm25: air.pm25,
		no2: air.no2,
		o3: air.o3
	};
}
function todayInToronto() {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: HALTON.timezone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(/* @__PURE__ */ new Date());
}
function spaceForDate(date, points, space) {
	const kp = kpForDate(points, date);
	const observed = bestFlare(space.flaresByDate.get(date) ?? []);
	const forecast = space.rByDate.get(date);
	const flareScore = Math.max(observed.score, forecast?.score ?? 0);
	const flareClass = observed.maxClass !== "None" ? observed.maxClass : "None";
	return {
		kpMax: kp,
		flareClass,
		flareScore,
		rScale: forecast?.rScale ?? 0,
		rLabel: forecast?.label ?? (flareClass === "None" ? "No significant flare" : `GOES ${flareClass}`)
	};
}
function kpForDate(points, date) {
	const vals = points.filter((p) => torontoDate(p.time) === date).map((p) => p.kp);
	if (vals.length) return Math.max(...vals);
	return points.at(-1)?.kp ?? 2;
}
function torontoDate(iso) {
	const hasZone = /Z$|[+-]\d{2}:\d{2}$/.test(iso);
	const d = new Date(hasZone ? iso : `${iso}Z`);
	if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: HALTON.timezone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(d);
}
async function loadWeather() {
	try {
		const hourly = await loadOpenMeteoEnsemble();
		if (hourly.length >= 48) return {
			hourly,
			source: "Open-Meteo ensemble (GEM/GFS mix) · Halton midpoint"
		};
	} catch {}
	return {
		hourly: await loadMetNorway(),
		source: "MET Norway location forecast · Halton midpoint"
	};
}
async function loadOpenMeteoEnsemble() {
	const url = new URL("https://ensemble-api.open-meteo.com/v1/ensemble");
	url.searchParams.set("latitude", String(HALTON.lat));
	url.searchParams.set("longitude", String(HALTON.lon));
	url.searchParams.set("hourly", [
		"temperature_2m",
		"relative_humidity_2m",
		"precipitation",
		"snowfall",
		"pressure_msl",
		"wind_speed_10m",
		"wind_gusts_10m",
		"cloud_cover",
		"weather_code"
	].join(","));
	url.searchParams.set("timezone", HALTON.timezone);
	url.searchParams.set("past_days", "2");
	url.searchParams.set("forecast_days", "7");
	const res = await fetch(url, { headers: { Accept: "application/json" } });
	if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
	const json = await res.json();
	return json.hourly.time.map((time, i) => ({
		time,
		temperature: num(json.hourly.temperature_2m[i]),
		humidity: num(json.hourly.relative_humidity_2m[i]),
		precipitation: num(json.hourly.precipitation[i]),
		snowfall: num(json.hourly.snowfall?.[i]),
		pressure: num(json.hourly.pressure_msl[i]),
		wind: num(json.hourly.wind_speed_10m[i]),
		gust: num(json.hourly.wind_gusts_10m[i]),
		cloud: num(json.hourly.cloud_cover[i]),
		weatherCode: num(json.hourly.weather_code[i])
	}));
}
async function loadMetNorway() {
	const url = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${HALTON.lat}&lon=${HALTON.lon}`;
	const res = await fetch(url, { headers: {
		Accept: "application/json",
		"User-Agent": "HaloHalton/1.0 (Oakville-Burlington migraine forecast)"
	} });
	if (!res.ok) throw new Error(`MET Norway ${res.status}`);
	return (await res.json()).properties.timeseries.map((row) => {
		const d = row.data.instant.details;
		const rain = row.data.next_1_hours?.details?.precipitation_amount ?? (row.data.next_6_hours?.details?.precipitation_amount != null ? row.data.next_6_hours.details.precipitation_amount / 6 : 0);
		const symbol = row.data.next_1_hours?.summary?.symbol_code ?? "";
		const snowy = symbol.includes("snow") || symbol.includes("sleet");
		const temp = d.air_temperature ?? null;
		return {
			time: toTorontoLocal(row.time),
			temperature: temp,
			humidity: d.relative_humidity ?? null,
			precipitation: rain,
			snowfall: snowy || temp != null && temp < .5 && rain > 0 ? rain : 0,
			pressure: d.air_pressure_at_sea_level ?? null,
			wind: d.wind_speed != null ? d.wind_speed * 3.6 : null,
			gust: d.wind_speed_of_gust != null ? d.wind_speed_of_gust * 3.6 : null,
			cloud: d.cloud_area_fraction ?? null,
			weatherCode: symbol.includes("thunder") ? 95 : snowy ? 73 : symbol.includes("rain") ? 61 : 1
		};
	});
}
function toTorontoLocal(isoUtc) {
	const d = new Date(isoUtc);
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: HALTON.timezone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(d);
	const pick = (t) => parts.find((p) => p.type === t)?.value ?? "00";
	return `${pick("year")}-${pick("month")}-${pick("day")}T${pick("hour")}:${pick("minute")}`;
}
async function loadKp() {
	try {
		const res = await fetch("https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json", { headers: { Accept: "application/json" } });
		if (!res.ok) throw new Error(String(res.status));
		return parseKp(await res.json());
	} catch {
		return [];
	}
}
function parseKp(json) {
	if (!Array.isArray(json) || json.length === 0) return [];
	const first = json[0];
	if (first && typeof first === "object" && !Array.isArray(first)) return json.map((row) => {
		const time = String(row.time_tag ?? row.time ?? "");
		const kp = Number(row.kp ?? row.Kp ?? row.kp_index);
		if (!time || !Number.isFinite(kp)) return null;
		return {
			time,
			kp
		};
	}).filter((x) => x != null);
	if (Array.isArray(first)) return json.slice(1).map((r) => ({
		time: r[0],
		kp: Number(r[1])
	})).filter((p) => Number.isFinite(p.kp));
	return [];
}
async function loadAirQuality() {
	const out = /* @__PURE__ */ new Map();
	try {
		const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
		url.searchParams.set("latitude", String(HALTON.lat));
		url.searchParams.set("longitude", String(HALTON.lon));
		url.searchParams.set("hourly", "pm2_5,nitrogen_dioxide,ozone");
		url.searchParams.set("timezone", HALTON.timezone);
		url.searchParams.set("past_days", "2");
		url.searchParams.set("forecast_days", "5");
		const res = await fetch(url, { headers: { Accept: "application/json" } });
		if (!res.ok) return out;
		const json = await res.json();
		const buckets = /* @__PURE__ */ new Map();
		json.hourly.time.forEach((t, i) => {
			const date = t.slice(0, 10);
			const b = buckets.get(date) ?? {
				pm: [],
				no2: [],
				o3: []
			};
			const pm = num(json.hourly.pm2_5[i]);
			const no2 = num(json.hourly.nitrogen_dioxide[i]);
			const o3 = num(json.hourly.ozone[i]);
			if (pm != null) b.pm.push(pm);
			if (no2 != null) b.no2.push(no2);
			if (o3 != null) b.o3.push(o3);
			buckets.set(date, b);
		});
		for (const [date, b] of buckets) out.set(date, {
			pm25: mean(b.pm),
			no2: mean(b.no2),
			o3: mean(b.o3)
		});
	} catch {}
	return out;
}
async function loadSpaceWeather() {
	const flaresByDate = /* @__PURE__ */ new Map();
	const rByDate = /* @__PURE__ */ new Map();
	try {
		const res = await fetch("https://services.swpc.noaa.gov/json/goes/primary/xray-flares-7-day.json", { headers: { Accept: "application/json" } });
		if (res.ok) {
			const json = await res.json();
			for (const row of json) {
				const time = String(row.max_time ?? row.time_tag ?? "");
				const maxClass = String(row.max_class ?? "");
				if (!time || !maxClass) continue;
				const date = torontoDate(time);
				const list = flaresByDate.get(date) ?? [];
				list.push({
					time,
					maxClass
				});
				flaresByDate.set(date, list);
			}
		}
	} catch {}
	try {
		const res = await fetch("https://services.swpc.noaa.gov/products/noaa-scales.json", { headers: { Accept: "application/json" } });
		if (res.ok) {
			const json = await res.json();
			for (const key of Object.keys(json)) {
				const row = json[key];
				const date = row.DateStamp;
				if (!date) continue;
				const r = row.R ?? {};
				const parsed = rForecastScore({
					scale: r.Scale != null && r.Scale !== "" ? Number(r.Scale) : null,
					minorProb: r.MinorProb != null ? Number(r.MinorProb) : null,
					majorProb: r.MajorProb != null ? Number(r.MajorProb) : null
				});
				const prev = rByDate.get(date);
				if (!prev || parsed.score > prev.score) rByDate.set(date, parsed);
			}
		}
	} catch {}
	return {
		flaresByDate,
		rByDate
	};
}
function num(v) {
	if (v == null) return null;
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
}
//#endregion
export { getHaloForecast_createServerFn_handler };
