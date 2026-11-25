import { site } from "../../src/config/site.ts";

const FATSOMA = "https://www.fatsoma.com";

/**
 * The event page links on the club's Fatsoma profile, in page order.
 * Throws if this is not the profile page (an error page, say), so that a
 * failed fetch is never mistaken for "no upcoming events".
 */
export function parseListing(html: string): string[] {
  const canonical = (html.match(/<link\b[^>]*>/g) ?? []).find((tag) =>
    /\brel="canonical"/.test(tag),
  );
  if (!canonical?.includes(`href="${site.fatsomaUrl}"`)) {
    throw new Error("Not the WTF IS INDIE? Fatsoma profile page");
  }

  // Relative or fatsoma.com links only; any query string is dropped.
  const links = html.matchAll(
    /href="(?:https:\/\/www\.fatsoma\.com)?(\/e\/[a-z0-9]+\/[^"?#/]+)\/?(?:[?#][^"]*)?"/g,
  );
  return [...new Set(Array.from(links, (match) => FATSOMA + match[1]))];
}
