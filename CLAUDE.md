@AGENTS.md

## Design

The site is Alex's design: a single page, first written as plain HTML and ported to Next.js. Keep to it rather than adding a new look.

- **Styles:** plain CSS in `app/globals.css`, with the colour variables at the top. Light and dark follow the visitor's system setting. No Tailwind.
- **Font:** Schibsted Grotesk (400, 600, 700), loaded with `next/font/google` in `app/layout.tsx`.
- **Copy:** the page text is in `app/page.tsx`. The "How it connects" map has its own short captions in `app/connects-map.tsx` (`places` and `threads`), so update both when a fact changes.
- **Map:** `app/connects-map.tsx` is Alex's script running inside a client component. The section stays hidden until the script runs, so the page still reads fine without JavaScript. It also wires up the Career and On the side entries, which carry `data-place` ids matching the map's `places`: pointing at one lights it on the map, and clicking its heading picks it and scrolls the map into view.
- **Day/night:** the page follows the device setting until a visitor uses the footer toggle (`app/theme-toggle.tsx`, `app/theme.ts`). The choice is saved and applied by an inline script in `<head>` before paint. The switch spreads out in a circle using view transitions.
- **Motion:** every effect has a still fallback for `prefers-reduced-motion` and for browsers without support. The Career timeline draws itself using CSS scroll-driven animation.
- **Metadata:** title, description and the share image (`public/og.png`) are set in `app/layout.tsx`. Icons are `app/icon.svg` and `app/apple-icon.png`.
