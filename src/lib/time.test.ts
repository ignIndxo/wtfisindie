import { describe, expect, it } from "vitest";
import { formatLondonDate, formatLondonTime, londonDayKey, londonToUtc } from "./time";

describe("londonToUtc", () => {
  it.each([
    ["winter (GMT)", [2026, 11, 5, 22], "2026-11-05T22:00:00.000Z"],
    ["summer (BST)", [2026, 7, 2, 22], "2026-07-02T21:00:00.000Z"],
    ["day before the clocks go forward", [2026, 3, 28, 22], "2026-03-28T22:00:00.000Z"],
    ["day after the clocks go forward", [2026, 3, 30, 22], "2026-03-30T21:00:00.000Z"],
    ["week before the clocks go back", [2026, 10, 22, 22], "2026-10-22T21:00:00.000Z"],
    ["week after the clocks go back", [2026, 10, 29, 22], "2026-10-29T22:00:00.000Z"],
  ] as const)("converts a time in %s", (_, [year, month, day, hour], expected) => {
    expect(londonToUtc(year, month, day, hour).toISOString()).toBe(expected);
  });
});

describe("London formatting", () => {
  // Fatsoma's timestamps are real UTC: it displays this one as 2:00pm.
  it("shows a summer UTC timestamp an hour later, in London time", () => {
    expect(formatLondonTime(new Date("2027-05-28T13:00:00.000Z"))).toBe("2PM");
  });

  it("shows a winter UTC timestamp unchanged", () => {
    expect(formatLondonTime(new Date("2026-11-26T22:00:00.000Z"))).toBe("10PM");
  });

  it("includes minutes only when they are not zero", () => {
    expect(formatLondonTime(londonToUtc(2026, 7, 2, 22, 30))).toBe("10:30PM");
    expect(formatLondonTime(londonToUtc(2026, 7, 3, 2))).toBe("2AM");
  });

  it("splits a date into the pieces the event card needs", () => {
    expect(formatLondonDate(londonToUtc(2026, 11, 5, 22))).toEqual({
      weekday: "THU",
      day: "05",
      month: "NOV",
    });
  });

  it("uses the London calendar day, not the UTC one", () => {
    // 23:30 UTC in summer is already 00:30 the next day in London.
    expect(londonDayKey(new Date("2026-07-02T23:30:00.000Z"))).toBe("2026-07-03");
  });
});
