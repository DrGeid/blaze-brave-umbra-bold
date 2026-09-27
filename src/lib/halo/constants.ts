import type { Evidence, FactorId, FactorMeta, PhenotypeId } from "./types";

export const HALTON = {
  name: "Halton",
  region: "Oakville & Burlington, Ontario",
  lat: 43.3965,
  lon: -79.7434,
  timezone: "America/Toronto",
} as const;

export const LOAD_MAX = 1700;

export const FACTOR_META: Record<FactorId, FactorMeta> = {
  pressure_drop: {
    id: "pressure_drop",
    label: "Pressure drop",
    short: "Falling air pressure",
    evidence: "strong",
    unit: "hPa / 24h",
  },
  low_pressure: {
    id: "low_pressure",
    label: "Low pressure",
    short: "Absolute sea-level pressure",
    evidence: "strong",
    unit: "hPa",
  },
  humidity: {
    id: "humidity",
    label: "Humidity",
    short: "Moisture in the air",
    evidence: "mixed",
    unit: "%",
  },
  rain: {
    id: "rain",
    label: "Rain & storms",
    short: "Precipitation and thunder",
    evidence: "mixed",
    unit: "mm",
  },
  temp_swing: {
    id: "temp_swing",
    label: "Temperature swing",
    short: "Day range and day-to-day change",
    evidence: "mixed",
    unit: "°C",
  },
  wind_front: {
    id: "wind_front",
    label: "Wind & fronts",
    short: "Gusts and incoming fronts",
    evidence: "mixed",
    unit: "km/h",
  },
  extremes: {
    id: "extremes",
    label: "Heat or cold",
    short: "Halton temperature extremes",
    evidence: "mixed",
    unit: "°C",
  },
  glare: {
    id: "glare",
    label: "Light & glare",
    short: "Bright sky, snow glare, photophobia",
    evidence: "mixed",
    unit: "cloud %",
  },
  pm25: {
    id: "pm25",
    label: "Wildfire / PM2.5",
    short: "Fine particles and smoke",
    evidence: "strong",
    unit: "µg/m³",
  },
  air_pollution: {
    id: "air_pollution",
    label: "NO₂ & ozone",
    short: "Traffic and photochemical smog",
    evidence: "mixed",
    unit: "µg/m³",
  },
  pollen: {
    id: "pollen",
    label: "Pollen",
    short: "Tree, grass, and ragweed load",
    evidence: "mixed",
    unit: "index",
  },
  geomagnetic: {
    id: "geomagnetic",
    label: "Geomagnetic field",
    short: "Planetary Kp index",
    evidence: "mixed",
    unit: "Kp",
  },
  solar_flare: {
    id: "solar_flare",
    label: "Solar flare",
    short: "GOES X-ray class and R-scale",
    evidence: "anecdotal",
    unit: "class",
  },
  spring_tide: {
    id: "spring_tide",
    label: "Spring tide",
    short: "Luni-solar gravity alignment",
    evidence: "mixed",
    unit: "syzygy",
  },
  moon: {
    id: "moon",
    label: "Moon cycle",
    short: "New and full moon proximity",
    evidence: "mixed",
    unit: "phase",
  },
  eclipse: {
    id: "eclipse",
    label: "Eclipse",
    short: "Solar/lunar eclipse window",
    evidence: "anecdotal",
    unit: "days",
  },
  mercury: {
    id: "mercury",
    label: "Mercury retrograde",
    short: "Apparent retrograde of Mercury",
    evidence: "anecdotal",
    unit: "",
  },
};

export const EVIDENCE_COPY: Record<Evidence, string> = {
  strong: "Stronger clinical signal",
  mixed: "Mixed / individual",
  anecdotal: "Anecdotal · low weight",
};

export const PHENOTYPE_META: Record<
  PhenotypeId,
  { label: string; feel: string; detail: string }
> = {
  temple: {
    label: "Temple squeeze",
    feel: "Vice or clamp at the sides of the head, temporalis tightness",
    detail:
      "Weighted toward falling and low barometric pressure — the vascular / temporalis pattern patients call a vice at the temples.",
  },
  frontal: {
    label: "Frontal pressure",
    feel: "Forehead, glabella, or 'sinus' pressure — often mistaken for a sinus infection",
    detail:
      "Weighted toward falling/low pressure, humidity, pollen, and smoke. This is the weather-sinus map of the forehead, separate from a temple vice and from pain behind the eyes.",
  },
  ocular: {
    label: "Ocular strain",
    feel: "Pressure behind or around the eyes, glare, visual effort",
    detail:
      "Weighted toward glare (including snow), humidity, pollen, smoke, and pressure change. Eclipse windows stay a low anecdotal term.",
  },
  occipital: {
    label: "Occipital tension",
    feel: "Tightness at the base of the skull and neck",
    detail:
      "Weighted toward wind, weather fronts, and temperature swings — more musculoskeletal than sinus-cavity.",
  },
  sleep: {
    label: "Sleep disruption",
    feel: "Shallower or broken sleep that can lower the next-day migraine threshold",
    detail:
      "Weighted toward heat, humidity, storms, wind, smoke, and pollen — the night-time load. Poor sleep is a common pathway into an attack.",
  },
};

/** Relative weights. Weather and air dominate; sky factors stay small until a journal learns otherwise. */
export const BASE_WEIGHTS: Record<PhenotypeId, Record<FactorId, number>> = {
  temple: {
    pressure_drop: 1.45,
    low_pressure: 1.3,
    humidity: 0.85,
    rain: 0.7,
    temp_swing: 0.65,
    wind_front: 0.55,
    extremes: 0.5,
    glare: 0.3,
    pm25: 0.7,
    air_pollution: 0.45,
    pollen: 0.5,
    geomagnetic: 0.34,
    solar_flare: 0.08,
    spring_tide: 0.16,
    moon: 0.18,
    eclipse: 0.1,
    mercury: 0.04,
  },
  frontal: {
    pressure_drop: 1.5,
    low_pressure: 1.42,
    humidity: 1.4,
    rain: 1.1,
    temp_swing: 0.55,
    wind_front: 0.35,
    extremes: 0.45,
    glare: 0.45,
    pm25: 0.9,
    air_pollution: 0.75,
    pollen: 1.28,
    geomagnetic: 0.28,
    solar_flare: 0.08,
    spring_tide: 0.18,
    moon: 0.16,
    eclipse: 0.1,
    mercury: 0.04,
  },
  ocular: {
    pressure_drop: 1.15,
    low_pressure: 1.05,
    humidity: 1.25,
    rain: 0.55,
    temp_swing: 0.7,
    wind_front: 0.4,
    extremes: 0.65,
    glare: 1.4,
    pm25: 0.95,
    air_pollution: 0.7,
    pollen: 1.15,
    geomagnetic: 0.44,
    solar_flare: 0.1,
    spring_tide: 0.14,
    moon: 0.22,
    eclipse: 0.32,
    mercury: 0.04,
  },
  occipital: {
    pressure_drop: 1.0,
    low_pressure: 0.75,
    humidity: 0.55,
    rain: 0.85,
    temp_swing: 1.35,
    wind_front: 1.45,
    extremes: 1.15,
    glare: 0.25,
    pm25: 0.45,
    air_pollution: 0.3,
    pollen: 0.25,
    geomagnetic: 0.26,
    solar_flare: 0.06,
    spring_tide: 0.1,
    moon: 0.12,
    eclipse: 0.08,
    mercury: 0.04,
  },
  sleep: {
    pressure_drop: 0.55,
    low_pressure: 0.35,
    humidity: 1.05,
    rain: 1.25,
    temp_swing: 0.7,
    wind_front: 1.15,
    extremes: 1.4,
    glare: 0.85,
    pm25: 0.95,
    air_pollution: 0.55,
    pollen: 1.05,
    geomagnetic: 0.32,
    solar_flare: 0.1,
    spring_tide: 0.22,
    moon: 0.28,
    eclipse: 0.08,
    mercury: 0.04,
  },
};

export const DISCLAIMER =
  "Halo is an educational weather-sensitivity forecast for Halton Region. It is not a medical device, diagnosis, or treatment. Migraine has many triggers. If you have a sudden worst-ever headache, weakness, confusion, or vision loss, seek emergency care.";
