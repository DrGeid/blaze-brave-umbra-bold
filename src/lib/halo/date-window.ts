/** Calendar arithmetic in UTC avoids browser-timezone and DST drift. */
export function shiftDate(date: string, offset: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
}

export function forecastDateWindow(today: string): string[] {
  return Array.from({ length: 15 }, (_, index) => shiftDate(today, index - 7));
}
