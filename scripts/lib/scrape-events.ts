import { setTimeout as wait } from "node:timers/promises";
import { site } from "../../src/config/site.ts";
import type { WtfEvent } from "../../src/lib/events.ts";
import { isInSouthampton, type FatsomaEvent } from "./event-schema.ts";
import { fetchPage } from "./fetch-page.ts";
import { parseEventPage } from "./parse-event.ts";
import { parseListing } from "./parse-listing.ts";

interface ScrapeOptions {
  getPage?: (url: string) => Promise<string>;
  /** Delay before each event page, to go easy on Fatsoma. */
  pause?: () => Promise<unknown>;
  /** Accept a profile with no event links. */
  allowEmpty?: boolean;
}

/** schema.org statuses whose listed date will not happen. */
const CALLED_OFF = /Event(Cancelled|Postponed)$/;

function toWtfEvent(event: FatsomaEvent): WtfEvent {
  const [, , id, slug] = new URL(event.url).pathname.split("/");
  return {
    id,
    slug,
    title: event.name,
    start: new Date(event.startDate).toISOString(),
    end: new Date(event.endDate).toISOString(),
    venue: event.location.name,
    city: event.location.address.addressLocality,
    image: event.image,
    url: event.url,
  };
}

/**
 * The club's Southampton events from Fatsoma, soonest first. All or nothing:
 * if any page can't be read, this throws rather than return a partial list.
 */
export async function scrapeEvents(options: ScrapeOptions = {}): Promise<WtfEvent[]> {
  const { getPage = fetchPage, pause = () => wait(1000), allowEmpty = false } = options;

  const links = parseListing(await getPage(site.fatsomaUrl));
  if (links.length === 0 && !allowEmpty) {
    throw new Error(
      "Found no event links on the Fatsoma profile. There may be no events, or Fatsoma may " +
        "have changed its page. If there really are none, run again with --allow-empty.",
    );
  }

  const events: WtfEvent[] = [];
  for (const link of links) {
    await pause();
    let event: FatsomaEvent;
    try {
      event = parseEventPage(await getPage(link));
    } catch (error) {
      throw new Error(`Failed on ${link}\n${(error as Error).message}`, { cause: error });
    }
    if (CALLED_OFF.test(event.eventStatus ?? "") || !isInSouthampton(event)) continue;
    events.push(toWtfEvent(event));
  }

  return events.sort((a, b) => a.start.localeCompare(b.start));
}
