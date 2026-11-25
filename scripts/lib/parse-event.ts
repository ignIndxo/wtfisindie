import { z } from "zod";
import { fatsomaEventSchema, type FatsomaEvent } from "./event-schema.ts";

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

/** Fatsoma HTML-escapes some text inside its JSON ("Girls &amp; Boys"). */
function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, entity: string) => {
    if (entity[0] !== "#") return NAMED_ENTITIES[entity.toLowerCase()] ?? whole;
    const hex = entity[1].toLowerCase() === "x";
    const code = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
    return code <= 0x10ffff ? String.fromCodePoint(code) : whole;
  });
}

/** The schema.org Event object among a page's JSON-LD blocks, if there is one. */
function findEventData(html: string): unknown {
  const blocks = html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  );
  for (const [, block] of blocks) {
    try {
      const data = JSON.parse(block);
      if (data?.["@type"] === "Event") return data;
    } catch {
      // Fatsoma pages include some empty blocks; skip anything unreadable.
    }
  }
  return undefined;
}

/** Read and validate the event on a Fatsoma event page. Throws if it can't. */
export function parseEventPage(html: string): FatsomaEvent {
  const data = findEventData(html);
  if (!data) throw new Error("No event data found on the page");

  const result = fatsomaEventSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Event data failed validation:\n${z.prettifyError(result.error)}`);
  }

  const event = result.data;
  return {
    ...event,
    name: decodeEntities(event.name),
    location: { ...event.location, name: decodeEntities(event.location.name) },
  };
}
