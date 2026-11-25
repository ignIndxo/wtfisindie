import { describe, expect, it } from "vitest";
import { buildTickerItems, shortEventName } from "./ticker";

describe("shortEventName", () => {
  it.each([
    ["WTF IS INDIE? THE BEATLES SPECIAL! 👨👨👨👨", "THE BEATLES SPECIAL"],
    ["WTF IS INDIE? BLUR SPECIAL! 🍋", "BLUR SPECIAL"],
    ["wtf is indie - Halloween Special 🎃 !!", "Halloween Special"],
    ["WTF IS INDIE? LOVE NIGHT ❤️👨‍👩‍👧", "LOVE NIGHT"],
    ["FRESHERS 2027 SPECIAL", "FRESHERS 2027 SPECIAL"],
  ])("shortens %j", (title, expected) => {
    expect(shortEventName(title)).toBe(expected);
  });

  it("keeps the full title if nothing would be left", () => {
    expect(shortEventName("WTF IS INDIE? 🍋")).toBe("WTF IS INDIE? 🍋");
  });
});

describe("buildTickerItems", () => {
  it("leads with the next event", () => {
    expect(buildTickerItems("WTF IS INDIE? Blur Special! 🍋", 4)).toEqual([
      "BLUR SPECIAL TICKETS OUT",
      "BEST CLUB NIGHT IN SOUTHAMPTON",
      "ISSUE 004 OUT NOW",
    ]);
  });

  it("drops the ticket line when there are no upcoming events", () => {
    expect(buildTickerItems(undefined, 12)).toEqual([
      "BEST CLUB NIGHT IN SOUTHAMPTON",
      "ISSUE 012 OUT NOW",
    ]);
  });
});
