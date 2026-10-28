const LONDON = "Europe/London";

/** Offset of Europe/London from UTC, in minutes, at the given instant. */
function londonOffsetMinutes(at: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON,
    timeZoneName: "longOffset",
  }).formatToParts(at);
  const name = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(name);
  if (!match) return 0; // plain "GMT"
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
}

/**
 * Convert a London wall-clock time (month is 1-12) to the real UTC instant.
 * Fatsoma labels London local times as UTC, so scraped times go through this.
 */
export function londonToUtc(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
): Date {
  const wallClockAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  let utc = wallClockAsUtc - londonOffsetMinutes(new Date(wallClockAsUtc)) * 60_000;
  // Re-check at the corrected instant so times near a clock change stay right.
  utc = wallClockAsUtc - londonOffsetMinutes(new Date(utc)) * 60_000;
  return new Date(utc);
}

function londonParts(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: LONDON, ...options }).formatToParts(date);
}

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((p) => p.type === type)?.value ?? "";
}

/** "10PM", "10:30PM" in London time. */
export function formatLondonTime(date: Date): string {
  const parts = londonParts(date, { hour: "numeric", minute: "2-digit", hour12: true });
  const minute = part(parts, "minute");
  return `${part(parts, "hour")}${minute === "00" ? "" : `:${minute}`}${part(parts, "dayPeriod").toUpperCase()}`;
}

/** Day and month pieces for the date block, in London time. */
export function formatLondonDate(date: Date) {
  const parts = londonParts(date, { weekday: "short", day: "2-digit", month: "short" });
  return {
    weekday: part(parts, "weekday").toUpperCase(),
    day: part(parts, "day"),
    month: part(parts, "month").toUpperCase(),
  };
}

/** The London calendar day (YYYY-MM-DD) an instant falls on. */
export function londonDayKey(date: Date): string {
  const parts = londonParts(date, { year: "numeric", month: "2-digit", day: "2-digit" });
  return `${part(parts, "year")}-${part(parts, "month")}-${part(parts, "day")}`;
}
