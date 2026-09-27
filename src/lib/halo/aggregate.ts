import { maxNum, mean, minNum, sum } from "./math";
import { seasonalPollen } from "./pollen";
import type { DayWeather, HourSample } from "./types";

export function hourlyToDays(hourly: HourSample[]): DayWeather[] {
  const groups = new Map<string, HourSample[]>();
  for (const h of hourly) {
    const date = h.time.slice(0, 10);
    const list = groups.get(date) ?? [];
    list.push(h);
    groups.set(date, list);
  }
  const dates = [...groups.keys()].sort();
  const days: DayWeather[] = [];
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const hours = groups.get(date) ?? [];
    const prev = i > 0 ? groups.get(dates[i - 1]) ?? [] : [];
    const pressures = hours.map((h) => h.pressure);
    const prevPressures = prev.map((h) => h.pressure);
    const meanP = mean(pressures);
    const prevMeanP = mean(prevPressures);
    const drop24 = (prevMeanP ?? meanP ?? 1013) - (meanP ?? 1013);
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
      pollenLabel: pollen.label,
    });
  }
  return days;
}

function maxSlidingDrop(values: Array<number | null>, window: number): number {
  const xs = values.map((v) => (typeof v === "number" ? v : null));
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

function daytimeCloud(hours: HourSample[]): number | null {
  const day = hours.filter((h) => {
    const hour = Number(h.time.slice(11, 13));
    return hour >= 10 && hour <= 16;
  });
  return mean((day.length ? day : hours).map((h) => h.cloud));
}
