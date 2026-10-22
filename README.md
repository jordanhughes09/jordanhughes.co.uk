# jordanhughes.co.uk

Jordan Hughes's personal site: a single page built with Next.js and hosted on Vercel. The design is Alex's.

## Run it locally

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Where things are

- `app/page.tsx`: the page and its copy
- `app/connects-map.tsx`: the interactive "How it connects" map and its captions
- `app/theme-toggle.tsx` and `app/theme.ts`: the day/night toggle and the script that applies a saved choice
- `app/globals.css`: all styles, with light and dark colours at the top
- `app/layout.tsx`: font, title, description and share image (`public/og.png`)

Pushing to `main` deploys to production. Other branches get a Vercel preview.
