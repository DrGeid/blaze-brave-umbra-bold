import { createServerFn } from "@tanstack/react-start";
import { hourlyToDays } from "./aggregate";
import { DISCLAIMER, HALTON } from "./constants";
import { mean } from "./math";
import { shiftDate } from "./date-window";
import { buildDayResult, buildSky } from "./scoring";
import { bestFlare, rForecastScore, type FlareEvent } from "./space";
import type { DayWeather, HaloForecast, HourSample, SpaceDay } from "./types";

const CACHE_MS = 10 * 60 * 1000;
let cache: { at: number; data: HaloForecast } | null = null;

export const getHaloForecast = createServerFn({ method: "GET" }).handler(
  async (): Promise<HaloForecast> => {
    if (cache && Date.now() - cache.at < CACHE_MS) return cache.data;
    const data = await loadForecast();
    cache = { at: Date.now(), data };
    return data;
  },
);

async function loadForecast(): Promise<HaloForecast> {
  const [weather, kp, air, space] = await Promise.all([
    loadWeather(),
    loadKp(),
    loadAirQuality(),
    loadSpaceWeather(),
  ]);
  const { hourly, source } = weather;
  const daysWeather = hourlyToDays(hourly).map((d) => mergeAir(d, air.get(d.date)));
  const todayIso = todayInToronto();
  const results = daysWeather.map((w, i) => {
    const sky = buildSky(w.date, spaceForDate(w.date, kp, space));
    const prevMean = i > 0 ? daysWeather[i - 1].tempMean : null;
    const result = buildDayResult(w, sky, prevMean);
    const dataNotes: string[] = [];
    if (!kp.some((p) => torontoDate(p.time) === w.date))
      dataNotes.push(
        "Geomagnetic activity uses a baseline estimate because no daily reading is available.",
      );
    if (!air.has(w.date))
      dataNotes.push(
        "Air-quality readings are unavailable for this date; these terms use the model's baseline.",
      );
    if (w.date < todayIso)
      dataNotes.push(
        "Calculated from archived weather model estimates. These are not saved Halo forecasts or direct station observations. Pollen and sky terms remain estimates.",
      );
    return { ...result, dataNotes };
  });
  const today =
    results.find((d) => d.date === todayIso) ??
    results.find((d) => d.date > todayIso) ??
    results[Math.min(2, results.length - 1)];
  const startDate = shiftDate(todayIso, -7);
  const endDate = shiftDate(todayIso, 7);
  const forecastDays = results.filter((d) => d.date >= startDate && d.date <= endDate);
  const extras = [
    air.size ? "CAMS PM2.5/NO₂/O₃" : null,
    "NOAA GOES X-ray",
    "Halton pollen phenology",
  ]
    .filter(Boolean)
    .join(" · ");
  return {
    generatedAt: new Date().toISOString(),
    location: {
      name: HALTON.name,
      region: HALTON.region,
      lat: HALTON.lat,
      lon: HALTON.lon,
    },
    source: `${source} · ${extras}`,
    today,
    days: forecastDays,
    hourly: hourly.filter(
      (h) => h.time.slice(0, 10) >= startDate && h.time.slice(0, 10) <= endDate,
    ),
    disclaimer: DISCLAIMER,
  };
}

function mergeAir(
  day: DayWeather,
  air?: { pm25: number | null; no2: number | null; o3: number | null },
): DayWeather {
  if (!air) return day;
  return { ...day, pm25: air.pm25, no2: air.no2, o3: air.o3 };
}

function todayInToronto(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: HALTON.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

type KpPoint = { time: string; kp: number };

type SpacePack = {
  flaresByDate: Map<string, FlareEvent[]>;
  rByDate: Map<string, { score: number; rScale: number; label: string }>;
};

function spaceForDate(date: string, points: KpPoint[], space: SpacePack): SpaceDay {
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
    rLabel:
      forecast?.label ?? (flareClass === "None" ? "No significant flare" : `GOES ${flareClass}`),
  };
}

function kpForDate(points: KpPoint[], date: string): number {
  const vals = points.filter((p) => torontoDate(p.time) === date).map((p) => p.kp);
  if (vals.length) return Math.max(...vals);
  return 2;
}

function torontoDate(iso: string): string {
  const hasZone = /Z$|[+-]\d{2}:\d{2}$/.test(iso);
  const d = new Date(hasZone ? iso : `${iso}Z`);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: HALTON.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

async function loadWeather(): Promise<{ hourly: HourSample[]; source: string }> {
  try {
    const hourly = await loadOpenMeteo();
    if (hourly.length >= 48) {
      return { hourly, source: "Open-Meteo weather models and recent history · Halton midpoint" };
    }
  } catch {
    /* fall through */
  }
  const hourly = await loadMetNorway();
  return { hourly, source: "MET Norway location forecast · Halton midpoint" };
}

async function loadOpenMeteo(): Promise<HourSample[]> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(HALTON.lat));
  url.searchParams.set("longitude", String(HALTON.lon));
  url.searchParams.set(
    "hourly",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "precipitation",
      "snowfall",
      "pressure_msl",
      "wind_speed_10m",
      "wind_gusts_10m",
      "cloud_cover",
      "weather_code",
    ].join(","),
  );
  url.searchParams.set("timezone", HALTON.timezone);
  // One extra past day supplies the first visible day's pressure/temperature change.
  url.searchParams.set("past_days", "8");
  url.searchParams.set("forecast_days", "8");
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const json = (await res.json()) as {
    hourly: Record<string, Array<number | string | null>>;
  };
  const t = json.hourly.time as string[];
  return t.map((time, i) => ({
    time,
    temperature: num(json.hourly.temperature_2m[i]),
    humidity: num(json.hourly.relative_humidity_2m[i]),
    precipitation: num(json.hourly.precipitation[i]),
    snowfall: num(json.hourly.snowfall?.[i]),
    pressure: num(json.hourly.pressure_msl[i]),
    wind: num(json.hourly.wind_speed_10m[i]),
    gust: num(json.hourly.wind_gusts_10m[i]),
    cloud: num(json.hourly.cloud_cover[i]),
    weatherCode: num(json.hourly.weather_code[i]),
  }));
}

type MetJson = {
  properties: {
    timeseries: Array<{
      time: string;
      data: {
        instant: {
          details: {
            air_pressure_at_sea_level?: number;
            air_temperature?: number;
            relative_humidity?: number;
            cloud_area_fraction?: number;
            wind_speed?: number;
            wind_speed_of_gust?: number;
          };
        };
        next_1_hours?: {
          details?: { precipitation_amount?: number };
          summary?: { symbol_code?: string };
        };
        next_6_hours?: { details?: { precipitation_amount?: number } };
      };
    }>;
  };
};

async function loadMetNorway(): Promise<HourSample[]> {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${HALTON.lat}&lon=${HALTON.lon}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "HaloHalton/1.0 (Oakville-Burlington migraine forecast)",
    },
  });
  if (!res.ok) throw new Error(`MET Norway ${res.status}`);
  const json = (await res.json()) as MetJson;
  return json.properties.timeseries.map((row) => {
    const d = row.data.instant.details;
    const rain =
      row.data.next_1_hours?.details?.precipitation_amount ??
      (row.data.next_6_hours?.details?.precipitation_amount != null
        ? row.data.next_6_hours.details.precipitation_amount / 6
        : 0);
    const symbol = row.data.next_1_hours?.summary?.symbol_code ?? "";
    const snowy = symbol.includes("snow") || symbol.includes("sleet");
    const temp = d.air_temperature ?? null;
    return {
      time: toTorontoLocal(row.time),
      temperature: temp,
      humidity: d.relative_humidity ?? null,
      precipitation: rain,
      snowfall: snowy || (temp != null && temp < 0.5 && rain > 0) ? rain : 0,
      pressure: d.air_pressure_at_sea_level ?? null,
      wind: d.wind_speed != null ? d.wind_speed * 3.6 : null,
      gust: d.wind_speed_of_gust != null ? d.wind_speed_of_gust * 3.6 : null,
      cloud: d.cloud_area_fraction ?? null,
      weatherCode: symbol.includes("thunder") ? 95 : snowy ? 73 : symbol.includes("rain") ? 61 : 1,
    };
  });
}

function toTorontoLocal(isoUtc: string): string {
  const d = new Date(isoUtc);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: HALTON.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d);
  const pick = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${pick("year")}-${pick("month")}-${pick("day")}T${pick("hour")}:${pick("minute")}`;
}

async function loadKp(): Promise<KpPoint[]> {
  try {
    const res = await fetch(
      "https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json",
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as unknown;
    return parseKp(json);
  } catch {
    return [];
  }
}

function parseKp(json: unknown): KpPoint[] {
  if (!Array.isArray(json) || json.length === 0) return [];
  const first = json[0];
  if (first && typeof first === "object" && !Array.isArray(first)) {
    return (json as Array<Record<string, unknown>>)
      .map((row) => {
        const time = String(row.time_tag ?? row.time ?? "");
        const kp = Number(row.kp ?? row.Kp ?? row.kp_index);
        if (!time || !Number.isFinite(kp)) return null;
        return { time, kp };
      })
      .filter((x): x is KpPoint => x != null);
  }
  if (Array.isArray(first)) {
    const rows = json as Array<Array<string>>;
    return rows
      .slice(1)
      .map((r) => ({ time: r[0], kp: Number(r[1]) }))
      .filter((p) => Number.isFinite(p.kp));
  }
  return [];
}

async function loadAirQuality(): Promise<
  Map<string, { pm25: number | null; no2: number | null; o3: number | null }>
> {
  const out = new Map<string, { pm25: number | null; no2: number | null; o3: number | null }>();
  try {
    const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
    url.searchParams.set("latitude", String(HALTON.lat));
    url.searchParams.set("longitude", String(HALTON.lon));
    url.searchParams.set("hourly", "pm2_5,nitrogen_dioxide,ozone");
    url.searchParams.set("timezone", HALTON.timezone);
    url.searchParams.set("past_days", "7");
    url.searchParams.set("forecast_days", "7");
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return out;
    const json = (await res.json()) as {
      hourly: {
        time: string[];
        pm2_5: Array<number | null>;
        nitrogen_dioxide: Array<number | null>;
        ozone: Array<number | null>;
      };
    };
    const buckets = new Map<string, { pm: number[]; no2: number[]; o3: number[] }>();
    json.hourly.time.forEach((t, i) => {
      const date = t.slice(0, 10);
      const b = buckets.get(date) ?? { pm: [], no2: [], o3: [] };
      const pm = num(json.hourly.pm2_5[i]);
      const no2 = num(json.hourly.nitrogen_dioxide[i]);
      const o3 = num(json.hourly.ozone[i]);
      if (pm != null) b.pm.push(pm);
      if (no2 != null) b.no2.push(no2);
      if (o3 != null) b.o3.push(o3);
      buckets.set(date, b);
    });
    for (const [date, b] of buckets) {
      out.set(date, {
        pm25: mean(b.pm),
        no2: mean(b.no2),
        o3: mean(b.o3),
      });
    }
  } catch {
    /* optional feed */
  }
  return out;
}

async function loadSpaceWeather(): Promise<SpacePack> {
  const flaresByDate = new Map<string, FlareEvent[]>();
  const rByDate = new Map<string, { score: number; rScale: number; label: string }>();
  try {
    const res = await fetch(
      "https://services.swpc.noaa.gov/json/goes/primary/xray-flares-7-day.json",
      { headers: { Accept: "application/json" } },
    );
    if (res.ok) {
      const json = (await res.json()) as Array<Record<string, unknown>>;
      for (const row of json) {
        const time = String(row.max_time ?? row.time_tag ?? "");
        const maxClass = String(row.max_class ?? "");
        if (!time || !maxClass) continue;
        const date = torontoDate(time);
        const list = flaresByDate.get(date) ?? [];
        list.push({ time, maxClass });
        flaresByDate.set(date, list);
      }
    }
  } catch {
    /* optional */
  }
  try {
    const res = await fetch("https://services.swpc.noaa.gov/products/noaa-scales.json", {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const json = (await res.json()) as Record<
        string,
        {
          DateStamp?: string;
          R?: {
            Scale?: string | null;
            MinorProb?: string | null;
            MajorProb?: string | null;
            Text?: string | null;
          };
        }
      >;
      for (const key of Object.keys(json)) {
        const row = json[key];
        const date = row.DateStamp;
        if (!date) continue;
        const r = row.R ?? {};
        const parsed = rForecastScore({
          scale: r.Scale != null && r.Scale !== "" ? Number(r.Scale) : null,
          minorProb: r.MinorProb != null ? Number(r.MinorProb) : null,
          majorProb: r.MajorProb != null ? Number(r.MajorProb) : null,
        });
        const prev = rByDate.get(date);
        if (!prev || parsed.score > prev.score) rByDate.set(date, parsed);
      }
    }
  } catch {
    /* optional */
  }
  return { flaresByDate, rByDate };
}

function num(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
