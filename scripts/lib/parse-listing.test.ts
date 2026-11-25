import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseListing } from "./parse-listing";

const listing = readFileSync(new URL("../__fixtures__/listing.html", import.meta.url), "utf8");

describe("parseListing", () => {
  it("returns each Fatsoma event link once, in page order", () => {
    expect(parseListing(listing)).toEqual([
      "https://www.fatsoma.com/e/aaaa1111/sample-special",
      "https://www.fatsoma.com/e/bbbb2222/second-sample",
      "https://www.fatsoma.com/e/cccc3333/away-sample",
    ]);
  });

  it("returns an empty list for a profile page with no event links", () => {
    const noEvents = listing.replace(/<a [^>]*\/e\/[^>]*>.*?<\/a>/g, "");
    expect(parseListing(noEvents)).toEqual([]);
  });

  it.each([
    ["an error page", "<html><title>Fatsoma</title><body>Something went wrong</body></html>"],
    ["an empty response", ""],
    ["another organiser's profile", listing.replace(/p\/wtfisindie/g, "p/someone-else")],
  ])("throws for %s instead of reporting no events", (_, html) => {
    expect(() => parseListing(html)).toThrow(/profile page/);
  });
});
