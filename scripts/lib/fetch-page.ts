import { setTimeout as wait } from "node:timers/promises";

/** Says who is asking, so Fatsoma can get in touch or block us if they want to. */
export const USER_AGENT = "wtfisindie-site/0.1 (+https://wtfisindie.club)";

interface FetchOptions {
  fetch?: typeof fetch;
  attempts?: number;
  timeoutMs?: number;
  sleep?: (ms: number) => Promise<unknown>;
}

/**
 * Download a page as text. Timeouts, network errors, 429 and server errors are
 * retried with a growing delay; other errors (such as 404) fail straight away.
 */
export async function fetchPage(url: string, options: FetchOptions = {}): Promise<string> {
  const { fetch: request = fetch, attempts = 3, timeoutMs = 20_000, sleep = wait } = options;

  for (let attempt = 1; ; attempt++) {
    let failure: string;
    let retryable = true;
    try {
      const response = await request(url, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (response.ok) return await response.text();
      failure = `HTTP ${response.status}`;
      retryable = response.status === 429 || response.status >= 500;
    } catch (error) {
      failure = error instanceof Error ? error.message : String(error);
    }

    if (!retryable || attempt >= attempts) {
      throw new Error(`Could not fetch ${url}: ${failure} (attempt ${attempt} of ${attempts})`);
    }
    await sleep(2000 * 2 ** (attempt - 1));
  }
}
