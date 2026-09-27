import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HourSample } from "@/lib/halo/types";

export function PressureChart({ hourly }: { hourly: HourSample[] }) {
  const data = useMemo(
    () =>
      hourly
        .filter((h) => h.pressure != null)
        .map((h) => ({
          t: h.time.slice(5, 13).replace("T", " "),
          p: h.pressure,
          h: h.humidity,
        })),
    [hourly],
  );

  if (data.length < 4) return null;

  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6">
      <p className="text-xs uppercase tracking-[0.16em] text-faint">Barometer</p>
      <h2 className="mt-1 font-display text-2xl">Sea-level pressure</h2>
      <p className="mt-1 text-sm text-muted">Halton midpoint · last two days and the week ahead</p>
      <div className="mt-4 h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="t"
              tick={{ fill: "var(--color-faint)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={28}
            />
            <YAxis
              domain={["dataMin - 2", "dataMax + 2"]}
              tick={{ fill: "var(--color-faint)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={42}
              unit=" hPa"
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(value, name) => [
                name === "p" ? `${Number(value).toFixed(1)} hPa` : `${Number(value).toFixed(0)}%`,
                name === "p" ? "Pressure" : "Humidity",
              ]}
            />
            <Line
              type="monotone"
              dataKey="p"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
