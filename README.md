# WTF is Indie?

Website for WTF is Indie?, Southampton's indie night. Built with
[Astro](https://astro.build) (static output) and Tailwind CSS 4.

## Commands

Requires Node 24 (see `.nvmrc`). On a fresh copy, run `npm run scrape` before
`npm run dev` or `npm run build`: the site needs the fetched events. Run it again
whenever you want the latest ones.

| Command           | Action                                  |
| ----------------- | --------------------------------------- |
| `npm install`     | Install dependencies                    |
| `npm run dev`     | Start the dev server at `localhost:4321` |
| `npm run build`   | Build the static site to `dist/`        |
| `npm run preview` | Preview the built site locally          |
| `npm test`        | Run the tests                           |
| `npm run scrape`  | Fetch events from Fatsoma               |

## Publishing

Once this is on `main` and the repository's Pages source is set to "GitHub
Actions", the **Publish site** workflow fetches events, builds and publishes:

- every day at 06:17 UTC (GitHub may start it late);
- on every push to `main`;
- by hand: **Actions → Publish site → Run workflow**.

If it fails, the live site stays as it was; open the failed run on the Actions
tab to see why. If it failed because Fatsoma really lists no events, run it by
hand with "Publish even if Fatsoma lists no events" ticked.

GitHub turns off scheduled workflows in a public repository after 60 days with no
repository activity. Re-enable it from the Actions tab.

## Structure

```
public/            copied to the build as-is (fonts, CNAME)
src/layouts/       page layouts
src/pages/         routes
src/styles/        global CSS and design tokens
```

## Font

NIGHTJUMP (italic), self-hosted from `public/fonts/` as WOFF2 with a TTF
fallback.
