import { describe, expect, it, vi } from "vitest";
import { removeFinished } from "./expiry";

const card = (end?: string) => ({ dataset: { end }, remove: vi.fn() });
const now = Date.parse("2026-11-27T02:00:00.000Z");

describe("removeFinished", () => {
  it("removes events that have ended, including right on the end time", () => {
    const earlier = card("2026-11-20T02:00:00.000Z");
    const justEnded = card("2026-11-27T02:00:00.000Z");
    removeFinished([earlier, justEnded], now);
    expect(earlier.remove).toHaveBeenCalledOnce();
    expect(justEnded.remove).toHaveBeenCalledOnce();
  });

  it("keeps events that are running or still to come", () => {
    const running = card("2026-11-27T02:00:00.001Z");
    const later = card("2026-12-04T02:00:00.000Z");
    removeFinished([running, later], now);
    expect(running.remove).not.toHaveBeenCalled();
    expect(later.remove).not.toHaveBeenCalled();
  });

  it.each([undefined, "", "not a date"])("keeps an element whose end is %j", (end) => {
    const unknown = card(end);
    removeFinished([unknown], now);
    expect(unknown.remove).not.toHaveBeenCalled();
  });
});
