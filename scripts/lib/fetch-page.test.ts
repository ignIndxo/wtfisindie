import { describe, expect, it, vi } from "vitest";
import { fetchPage, USER_AGENT } from "./fetch-page";

const PAGE = "https://www.fatsoma.com/p/wtfisindie";
const ok = () => new Response("page text", { status: 200 });
const status = (code: number) => () => new Response("", { status: code });
const networkError = (): Response => {
  throw new TypeError("fetch failed");
};

/** A fake fetch that plays the given responses in order. */
function fakeFetch(...responses: Array<() => Response>) {
  const request = vi.fn(async () => responses[request.mock.calls.length - 1]());
  return request;
}

const sleep = async () => {};

describe("fetchPage", () => {
  it("returns the page text and identifies itself", async () => {
    const request = fakeFetch(ok);
    await expect(fetchPage(PAGE, { fetch: request, sleep })).resolves.toBe("page text");
    expect(request).toHaveBeenCalledWith(
      PAGE,
      expect.objectContaining({ headers: { "User-Agent": USER_AGENT } }),
    );
  });

  it.each([
    ["a server error", status(503)],
    ["being rate limited", status(429)],
    ["a network error", networkError],
  ])("retries after %s", async (_, failure) => {
    const request = fakeFetch(failure, ok);
    await expect(fetchPage(PAGE, { fetch: request, sleep })).resolves.toBe("page text");
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("gives up after three attempts, waiting longer each time", async () => {
    const waits: number[] = [];
    const request = fakeFetch(status(500), status(500), status(500));
    await expect(
      fetchPage(PAGE, { fetch: request, sleep: async (ms) => waits.push(ms) }),
    ).rejects.toThrow(/HTTP 500 \(attempt 3 of 3\)/);
    expect(waits).toEqual([2000, 4000]);
  });

  it("does not retry a missing page", async () => {
    const request = fakeFetch(status(404));
    await expect(fetchPage(PAGE, { fetch: request, sleep })).rejects.toThrow(/HTTP 404/);
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("stops waiting on a request that never answers", async () => {
    const hang: typeof fetch = (_, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
      });
    await expect(fetchPage(PAGE, { fetch: hang, timeoutMs: 20, attempts: 1 })).rejects.toThrow(
      /timeout/i,
    );
  });
});
