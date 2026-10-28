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
