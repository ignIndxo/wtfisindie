import { describe, expect, it } from "vitest";
import { fatsomaEventSchema, isInSouthampton } from "./event-schema";

/** Same shape as a real event page, with made-up details. */
const sample = {
  "@context": "https://schema.org",
  "@type": "Event",
  url: "https://www.fatsoma.com/e/aaaa1111/sample-special",
  name: "WTF IS INDIE? SAMPLE SPECIAL! 🍋",
  startDate: "2026-11-26T22:00:00.000Z",
  endDate: "2026-11-27T02:00:00.000Z",
  eventStatus: "EventScheduled",
  image: "https://cdn2.fatsoma.com/media/sample",
  location: {
    "@type": "Place",
    name: "Clowns Wine Bar and Jesters Nightclub",
    address: { "@type": "PostalAddress", addressLocality: "Southampton" },
  },
  offers: [{ "@type": "Offer", price: 4, priceCurrency: "GBP", availability: "InStock" }],
};

const inTown = (addressLocality: string) => ({
  ...sample,
  location: { ...sample.location, address: { addressLocality } },
});

describe("fatsomaEventSchema", () => {
  it("accepts an event with everything the site needs", () => {
    expect(fatsomaEventSchema.safeParse(sample).success).toBe(true);
  });

  it("accepts an event with no image, price or status", () => {
    const { image, offers, eventStatus, ...bare } = sample;
    expect(fatsomaEventSchema.safeParse(bare).success).toBe(true);
  });

  it.each([
    ["a blank name", { name: "   " }],
    ["a missing start date", { startDate: undefined }],
    ["a start time with no timezone", { startDate: "2026-11-26T22:00:00" }],
    ["an end before the start", { endDate: "2026-11-26T21:00:00.000Z" }],
    ["a link that is not a Fatsoma event page", { url: "https://example.com/e/aaaa1111/x" }],
    ["a non-https image", { image: "javascript:alert(1)" }],
    ["a missing location", { location: undefined }],
    ["a negative price", { offers: [{ price: -1 }] }],
  ])("rejects %s", (_, change) => {
    expect(fatsomaEventSchema.safeParse({ ...sample, ...change }).success).toBe(false);
  });

  it("rejects an event whose town is missing, rather than guessing", () => {
    const noTown = { ...sample, location: { name: "Somewhere", address: {} } };
    expect(fatsomaEventSchema.safeParse(noTown).success).toBe(false);
  });
});

describe("isInSouthampton", () => {
  it.each([
    ["Southampton", true],
    ["  SOUTHAMPTON  ", true],
    ["Brighton and Hove", false],
  ])("for %j is %s", (town, expected) => {
    expect(isInSouthampton(fatsomaEventSchema.parse(inTown(town)))).toBe(expected);
  });
});
