# WTF is Indie?

Static website for wtfisindie. Currently a "coming soon" holding page.

## Structure

```
index.html        page entry point
css/style.css     styles
js/main.js        scripts
assets/fonts/     self-hosted fonts
assets/images/    images
```

No build step yet; the repo root is served as-is. If a bundler/framework is
introduced later, build output goes to `dist/` (already git-ignored).

## Font

The page uses **NIGHTJUMP** (italic), self-hosted from `assets/fonts/NIGHTJUMP.woff2` (TTF as fallback).

## Local preview

    python -m http.server 8000

then open http://localhost:8000.
