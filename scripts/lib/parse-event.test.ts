import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseEventPage } from "./parse-event";

const page = readFileSync(new URL("../__fixtures__/event.html", import.meta.url), "utf8");

describe("parseEventPage", () => {
  it("finds the event among the page's data blocks", () => {
    expect(parseEventPage(page)).toMatchObject({
      url: "https://www.fatsoma.com/e/aaaa1111/sample-special",
      startDate: "2026-11-26T22:00:00.000Z",
      endDate: "2026-11-27T02:00:00.000Z",
      location: { address: { addressLocality: "Southampton" } },
    });
  });

  it("turns escaped characters back into text", () => {
    expect(parseEventPage(page).name).toBe("WTF IS INDIE? GIRLS & BOYS SPECIAL! 🍋");
  });

  it("decodes numbered characters once, leaving unknown ones alone", () => {
    const odd = page.replace("GIRLS &amp; BOYS", "A&#39;S &#x26; &amp;amp; &madeup; &#99999999;");
    expect(parseEventPage(odd).name).toBe(
      "WTF IS INDIE? A'S & &amp; &madeup; &#99999999; SPECIAL! 🍋",
    );
  });

  it("throws when the page has no event data", () => {
    expect(() => parseEventPage("<html><body>Not found</body></html>")).toThrow(/No event data/);
  });

  it("throws when the event data is cut off", () => {
    const broken = page.replace('"offers"', "").replace(/\]\s*\}\s*<\/script>/, "</script>");
    expect(() => parseEventPage(broken)).toThrow(/No event data/);
  });

  it("says which field is wrong when validation fails", () => {
    const noStart = page.replace('"startDate"', '"startsAt"');
    expect(() => parseEventPage(noStart)).toThrow(/startDate/);
  });
});
