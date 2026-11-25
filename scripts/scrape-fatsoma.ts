// Fetch upcoming events from Fatsoma into src/data/events.json (not committed).
// Usage: npm run scrape [-- --allow-empty]
import { mkdir, rename, writeFile } from "node:fs/promises";
import { scrapeEvents } from "./lib/scrape-events.ts";

const output = new URL("../src/data/events.json", import.meta.url);

try {
  const events = await scrapeEvents({ allowEmpty: process.argv.includes("--allow-empty") });

  // Write to a temporary file first so a failure never leaves half a file.
  await mkdir(new URL(".", output), { recursive: true });
  const temporary = new URL("events.json.tmp", output);
  await writeFile(temporary, `${JSON.stringify(events, null, 2)}\n`);
  await rename(temporary, output);

  console.log(`Saved ${events.length} Southampton event(s) to src/data/events.json`);
  for (const event of events) console.log(`  ${event.start.slice(0, 10)}  ${event.title}`);
} catch (error) {
  console.error(`Scrape failed; the events file was not changed.\n${(error as Error).message}`);
  process.exitCode = 1;
}
