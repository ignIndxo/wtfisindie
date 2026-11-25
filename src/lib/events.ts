import { site } from "../config/site";
import { londonDayKey, londonToUtc } from "./time";

/** The shape of an event on the site. The Fatsoma scraper will produce this too. */
export interface WtfEvent {
  id: string;
  slug: string;
  title: string;
  description?: string;
  /** ISO 8601 UTC instant. */
  start: string;
  /** ISO 8601 UTC instant. */
  end: string;
  venue: string;
  city: string;
  image?: string;
  /** The event's own Fatsoma page. */
  url: string;
  soldOut?: boolean;
}

const THURSDAY = 4;

/** Placeholder nights (the next three Thursdays, 10pm to 2am) until the scraper lands. */
function placeholderEvents(now: Date): WtfEvent[] {
  const [year, month, day] = londonDayKey(now).split("-").map(Number);
  // Count from yesterday so a night that started yesterday and is still
  // running (after midnight) is not skipped.
  const yesterday = new Date(Date.UTC(year, month - 1, day - 1));
  const untilThursday = (THURSDAY - yesterday.getUTCDay() + 7) % 7;

  return [0, 1, 2, 3]
    .map((week) => {
      const night = new Date(yesterday);
      night.setUTCDate(yesterday.getUTCDate() + untilThursday + week * 7);
      const [y, m, d] = [night.getUTCFullYear(), night.getUTCMonth() + 1, night.getUTCDate()];
      return {
        id: `placeholder-${week + 1}`,
        slug: `placeholder-night-${week + 1}`,
        title: `WTF IS INDIE? EXAMPLE NIGHT ${week + 1}`,
        start: londonToUtc(y, m, d, 22).toISOString(),
        end: londonToUtc(y, m, d + 1, 2).toISOString(),
        venue: "Clowns Wine Bar and Jesters Nightclub",
        city: site.city,
        url: site.fatsomaUrl,
      };
    })
    .filter((event) => new Date(event.end) > now)
    .slice(0, 3);
}

/** Upcoming events, soonest first. */
export function getEvents(now = new Date()): WtfEvent[] {
  return placeholderEvents(now);
}
