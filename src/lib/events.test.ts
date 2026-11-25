import { describe, expect, it } from "vitest";
import { upcomingEvents, type WtfEvent } from "./events";

const night = (id: string, start: string, end: string): WtfEvent => ({
  id,
  slug: id,
  title: id,
  start,
  end,
  venue: "Venue",
  city: "Southampton",
  url: `https://www.fatsoma.com/e/${id}/${id}`,
});

// Summer nights, 10pm to 2am London time (9pm to 1am UTC).
const first = night("first", "2027-07-01T21:00:00.000Z", "2027-07-02T01:00:00.000Z");
const second = night("second", "2027-07-08T21:00:00.000Z", "2027-07-09T01:00:00.000Z");
const ids = (now: string, events = [second, first]) =>
  upcomingEvents(events, new Date(now)).map((event) => event.id);

describe("upcomingEvents", () => {
  it("lists the soonest first", () => {
    expect(ids("2027-06-28T12:00:00.000Z")).toEqual(["first", "second"]);
  });

  it("keeps a night that is still running after midnight", () => {
    expect(ids("2027-07-02T00:59:00.000Z")).toEqual(["first", "second"]);
  });

  it("drops a night the moment it ends", () => {
    expect(ids("2027-07-02T01:00:00.000Z")).toEqual(["second"]);
  });

  it("is empty once everything has finished", () => {
    expect(ids("2027-07-10T00:00:00.000Z")).toEqual([]);
  });

  it("does not reorder the list it was given", () => {
    const events = [second, first];
    ids("2027-06-28T12:00:00.000Z", events);
    expect(events).toEqual([second, first]);
  });
});
