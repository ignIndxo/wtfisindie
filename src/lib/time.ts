const LONDON = "Europe/London";

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
