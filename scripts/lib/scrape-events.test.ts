import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { scrapeEvents } from "./scrape-events";

const fixture = (name: string) =>
  readFileSync(new URL(`../__fixtures__/${name}`, import.meta.url), "utf8");
const listing = fixture("listing.html");
const eventPage = fixture("event.html");

const PROFILE = "https://www.fatsoma.com/p/wtfisindie";
const link = (path: string) => `https://www.fatsoma.com/e/${path}`;

/** An event page for a given link, with any extra text swaps applied. */
function pageFor(path: string, swaps: Record<string, string> = {}) {
  return Object.entries(swaps).reduce(
    (html, [from, to]) => html.replace(from, to),
    eventPage.replace("aaaa1111/sample-special", path),
  );
}

const pages: Record<string, string> = {
  [PROFILE]: listing,
  // Listed first but happening later, to check sorting.
  [link("aaaa1111/sample-special")]: pageFor("aaaa1111/sample-special", {
    "2026-11-26T22": "2026-12-03T22",
    "2026-11-27T02": "2026-12-04T02",
  }),
  [link("bbbb2222/second-sample")]: pageFor("bbbb2222/second-sample"),
  [link("cccc3333/away-sample")]: pageFor("cccc3333/away-sample", {
    '"addressLocality": "Southampton"': '"addressLocality": "Brighton and Hove"',
  }),
};

const run = (overrides: Record<string, string> = {}, allowEmpty = false) =>
  scrapeEvents({
    getPage: async (url) => {
      const page = { ...pages, ...overrides }[url];
      if (page === undefined) throw new Error(`Could not fetch ${url}: HTTP 404`);
      return page;
    },
    pause: async () => {},
    allowEmpty,
  });

const noLinks = listing.replace(/<a [^>]*\/e\/[^>]*>.*?<\/a>/g, "");

describe("scrapeEvents", () => {
  it("returns Southampton events soonest first, in the site's shape", async () => {
    const events = await run();
    expect(events.map((event) => event.id)).toEqual(["bbbb2222", "aaaa1111"]);
    expect(events[0]).toEqual({
      id: "bbbb2222",
      slug: "second-sample",
      title: "WTF IS INDIE? GIRLS & BOYS SPECIAL! 🍋",
      start: "2026-11-26T22:00:00.000Z",
      end: "2026-11-27T02:00:00.000Z",
      venue: "Clowns Wine Bar and Jesters Nightclub",
      city: "Southampton",
      image: "https://cdn2.fatsoma.com/media/sample",
      url: link("bbbb2222/second-sample"),
    });
  });

  it.each(["EventCancelled", "https://schema.org/EventPostponed"])(
    "leaves out an event marked %s",
    async (status) => {
      const events = await run({
        [link("bbbb2222/second-sample")]: pageFor("bbbb2222/second-sample", {
          EventScheduled: status,
        }),
      });
      expect(events.map((event) => event.id)).toEqual(["aaaa1111"]);
    },
  );

  it("fails as a whole, naming the page, if any event can't be read", async () => {
    await expect(run({ [link("bbbb2222/second-sample")]: "<html></html>" })).rejects.toThrow(
      /bbbb2222\/second-sample\nNo event data/,
    );
  });

  it("fails if the profile shows no event links", async () => {
    await expect(run({ [PROFILE]: noLinks })).rejects.toThrow(/--allow-empty/);
  });

  it("accepts an empty profile when told to", async () => {
    await expect(run({ [PROFILE]: noLinks }, true)).resolves.toEqual([]);
  });
});
