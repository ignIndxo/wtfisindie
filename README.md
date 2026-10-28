# WTF is Indie?

Website for WTF is Indie?, Southampton's indie night. Built with
[Astro](https://astro.build) (static output) and Tailwind CSS 4.

## Commands

Requires Node 24 (see `.nvmrc`).

| Command           | Action                                  |
| ----------------- | --------------------------------------- |
| `npm install`     | Install dependencies                    |
| `npm run dev`     | Start the dev server at `localhost:4321` |
| `npm run build`   | Build the static site to `dist/`        |
| `npm run preview` | Preview the built site locally          |

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
