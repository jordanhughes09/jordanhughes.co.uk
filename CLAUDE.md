@AGENTS.md

## Design

The site is Alex's design: a single page, first written as plain HTML and ported to Next.js. Keep to it rather than adding a new look.

- **Styles:** plain CSS in `app/globals.css`, with the colour variables at the top. Light and dark follow the visitor's system setting. No Tailwind.
- **Font:** Schibsted Grotesk (400, 600, 700), loaded with `next/font/google` in `app/layout.tsx`.
- **Copy:** the page text is in `app/page.tsx`. The "How it connects" map has its own short captions in `app/connects-map.tsx` (`places` and `threads`), so update both when a fact changes.
- **Map:** `app/connects-map.tsx` is Alex's script running inside a client component. The section stays hidden until the script runs, so the page still reads fine without JavaScript.
- **Metadata:** title, description and the share image (`public/og.png`) are set in `app/layout.tsx`. Icons are `app/icon.svg` and `app/apple-icon.png`.
