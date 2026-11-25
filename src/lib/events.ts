/** The shape of an event on the site. The Fatsoma scraper produces this. */
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

// Written by `npm run scrape`. A glob, so a missing file can be explained below
// rather than failing as an unresolved import.
const scraped = import.meta.glob<WtfEvent[]>("../data/events.json", {
  eager: true,
  import: "default",
});

/** The events that have not finished yet, soonest first. */
export function upcomingEvents(events: WtfEvent[], now: Date): WtfEvent[] {
  return events
    .filter((event) => Date.parse(event.end) > now.getTime())
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}

/** Upcoming events from the last Fatsoma fetch. */
export function getEvents(now = new Date()): WtfEvent[] {
  const [events] = Object.values(scraped);
  // Fail rather than quietly publish a site that claims there are no events.
  if (!events) throw new Error("No events file found. Run `npm run scrape` first.");
  return upcomingEvents(events, now);
}
