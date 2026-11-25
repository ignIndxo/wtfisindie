const CLUB_PREFIX = /^\s*WTF\s+IS\s+INDIE\??[\s:–-]*/i;
const EMOJI = /[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}‍️⃣]/gu;

/** "WTF IS INDIE? BLUR SPECIAL! 🍋" becomes "BLUR SPECIAL". */
export function shortEventName(title: string): string {
  const short = title
    .replace(CLUB_PREFIX, "")
    .replace(EMOJI, "")
    .replace(/\s+/g, " ")
    .replace(/[\s!]+$/, "")
    .trim();
  // A title that is only the club name or emoji is better left as it is.
  return short || title.trim();
}

/** The scrolling banner messages. The ticket line needs an upcoming event. */
export function buildTickerItems(nextEventTitle: string | undefined, latestIssue: number) {
  return [
    ...(nextEventTitle ? [`${shortEventName(nextEventTitle).toUpperCase()} TICKETS OUT`] : []),
    "BEST CLUB NIGHT IN SOUTHAMPTON",
    `ISSUE ${String(latestIssue).padStart(3, "0")} OUT NOW`,
  ];
}
