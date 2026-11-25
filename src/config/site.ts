export const site = {
  name: "WTF is Indie?",
  city: "Southampton",
  fatsomaUrl: "https://www.fatsoma.com/p/wtfisindie",
  instagramUrl: "https://www.instagram.com/whatthefuckisindie",
  // Base64 so the address is never in the page HTML as plain text (spam bots).
  // Decoded in the browser only when someone interacts with the Contact link.
  contactEncoded: "d2hhdHRoZWhlbGxpc2luZGllQGdtYWlsLmNvbQ==",
} as const;

export const nav = [
  { label: "NIGHTS", href: "#events" },
  { label: "THE ZINE", href: "#zine" },
  { label: "PHOTOS", href: "#gallery" },
  { label: "ABOUT", href: "#about" },
] as const;

// Placeholder until the zine content supplies the latest issue number.
export const latestIssue = 4;
