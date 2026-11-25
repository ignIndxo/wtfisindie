import { describe, expect, it } from "vitest";
import { formatLondonDate, formatLondonTime } from "./time";

describe("London formatting", () => {
  // Fatsoma's timestamps are real UTC: it displays this one as 2:00pm.
  it("shows a summer UTC timestamp an hour later, in London time", () => {
    expect(formatLondonTime(new Date("2027-05-28T13:00:00.000Z"))).toBe("2PM");
  });

  it("shows a winter UTC timestamp unchanged", () => {
    expect(formatLondonTime(new Date("2026-11-26T22:00:00.000Z"))).toBe("10PM");
  });

  it.each([
    ["the week before the clocks go back", "2026-10-22T21:00:00.000Z"],
    ["the week after the clocks go back", "2026-10-29T22:00:00.000Z"],
    ["the week before the clocks go forward", "2027-03-25T22:00:00.000Z"],
    ["the week after the clocks go forward", "2027-04-01T21:00:00.000Z"],
  ])("shows a 10pm start in %s", (_, instant) => {
    expect(formatLondonTime(new Date(instant))).toBe("10PM");
  });

  it("includes minutes only when they are not zero", () => {
    expect(formatLondonTime(new Date("2026-07-02T21:30:00.000Z"))).toBe("10:30PM");
    expect(formatLondonTime(new Date("2026-07-03T01:00:00.000Z"))).toBe("2AM");
  });

  it("splits a date into the pieces the event card needs", () => {
    expect(formatLondonDate(new Date("2026-11-05T22:00:00.000Z"))).toEqual({
      weekday: "THU",
      day: "05",
      month: "NOV",
    });
  });

  it("uses the London date, not the UTC one", () => {
    // 23:30 UTC in summer is already 00:30 the next day in London.
    expect(formatLondonDate(new Date("2026-07-02T23:30:00.000Z")).day).toBe("03");
  });
});
