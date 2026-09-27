export const FACTOR_IDS = [
  "pressure_drop",
  "low_pressure",
  "humidity",
  "rain",
  "temp_swing",
  "wind_front",
  "extremes",
  "glare",
  "pm25",
  "air_pollution",
  "pollen",
  "geomagnetic",
  "solar_flare",
  "spring_tide",
  "moon",
  "eclipse",
  "mercury",
] as const;

export type FactorId = (typeof FACTOR_IDS)[number];

export const PHENOTYPES = ["temple", "frontal", "ocular", "occipital", "sleep"] as const;
export type PhenotypeId = (typeof PHENOTYPES)[number];

export type Evidence = "strong" | "mixed" | "anecdotal";
export type Band = "quiet" | "watch" | "elevated" | "high" | "peak";

export type FactorMeta = {
  id: FactorId;
  label: string;
  short: string;
  evidence: Evidence;
  unit: string;
};

export type HourSample = {
  time: string;
  temperature: number | null;
  humidity: number | null;
  precipitation: number | null;
  snowfall: number | null;
  pressure: number | null;
  wind: number | null;
  gust: number | null;
  cloud: number | null;
  weatherCode: number | null;
};

export type DayWeather = {
  date: string;
  tempMax: number | null;
  tempMin: number | null;
  tempMean: number | null;
  humidityMean: number | null;
  precipSum: number | null;
  snowfallSum: number | null;
  pressureMean: number | null;
  pressureMin: number | null;
  pressureDrop24h: number;
  pressureDrop6h: number;
  windMax: number | null;
  gustMax: number | null;
  cloudDay: number | null;
  weatherCodeMax: number | null;
  pm25: number | null;
  no2: number | null;
  o3: number | null;
  pollenIndex: number;
  pollenLabel: string;
};

export type SkyContext = {
  moonPhase: number;
  moonName: string;
  moonIllumination: number;
  kpMax: number;
  kpLabel: string;
  eclipse: {
    name: string;
    date: string;
    daysAway: number;
    kind: "solar" | "lunar";
  } | null;
  eclipseSeason: boolean;
  mercury: {
    state: "direct" | "shadow" | "retrograde";
    label: string;
    until?: string;
  };
  springTide: number;
  perigee: number;
  tideLabel: string;
  flareClass: string;
  flareScore: number;
  rScale: number;
  rLabel: string;
};

export type SpaceDay = {
  kpMax: number;
  flareClass: string;
  flareScore: number;
  rScale: number;
  rLabel: string;
};

export type FactorScore = {
  id: FactorId;
  score: number;
  evidence: Evidence;
  observed: string;
  note: string;
};

export type PhenotypeScore = {
  id: PhenotypeId;
  score: number;
  band: Band;
  contributions: { id: FactorId; points: number; weight: number }[];
};

export type DayResult = {
  date: string;
  weather: DayWeather;
  sky: SkyContext;
  factors: FactorScore[];
  phenotypes: Record<PhenotypeId, PhenotypeScore>;
  load: number;
  loadMax: number;
  opportunity: number;
  band: Band;
  headline: string;
};

export type HaloForecast = {
  generatedAt: string;
  location: {
    name: string;
    region: string;
    lat: number;
    lon: number;
  };
  source: string;
  today: DayResult;
  days: DayResult[];
  hourly: HourSample[];
  disclaimer: string;
};

export type Intensity = 0 | 1 | 2 | 3;

export type JournalEntry = {
  id: string;
  date: string;
  createdAt: string;
  temple: Intensity;
  frontal: Intensity;
  ocular: Intensity;
  occipital: Intensity;
  sleep: Intensity;
  notes: string;
  factorSnapshot: Partial<Record<FactorId, number>> | null;
};
