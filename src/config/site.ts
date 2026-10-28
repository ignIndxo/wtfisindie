export const site = {
  name: "WTF is Indie?",
  city: "Southampton",
  fatsomaUrl: "https://www.fatsoma.com/p/wtfisindie",
  instagramUrl: "https://www.instagram.com/whatthefuckisindie",
  email: atob("d2hhdHRoZWhlbGxpc2luZGllQGdtYWlsLmNvbQ=="),
} as const;

export const nav = [
  { label: "NIGHTS", href: "#events" },
  { label: "THE ZINE", href: "#zine" },
  { label: "PHOTOS", href: "#gallery" },
  { label: "ABOUT", href: "#about" },
] as const;

export const tickerItems = [
  "EVERY THURSDAY AT JESTERS",
  "LOUD MUSIC / NICE PEOPLE",
  "SOUTHAMPTON AFTER DARK",
] as const;
