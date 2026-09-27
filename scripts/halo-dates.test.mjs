import test from "node:test";
import assert from "node:assert/strict";
import { forecastDateWindow, shiftDate } from "../src/lib/halo/date-window.ts";

test("15 dates include seven past, today, and seven future days across year boundaries", () => {
  const dates = forecastDateWindow("2026-01-01");
  assert.equal(dates.length, 15);
  assert.equal(new Set(dates).size, 15);
  assert.equal(dates[0], "2025-12-25");
  assert.equal(dates[7], "2026-01-01");
  assert.equal(dates[14], "2026-01-08");
});

test("calendar arithmetic preserves days over leap day and Toronto DST transitions", () => {
  assert.equal(shiftDate("2024-03-01", -1), "2024-02-29");
  for (const today of ["2026-03-08", "2026-11-01"]) {
    const dates = forecastDateWindow(today);
    for (let i = 1; i < dates.length; i++)
      assert.equal(Date.parse(dates[i]) - Date.parse(dates[i - 1]), 86400000);
  }
});
