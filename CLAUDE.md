# OMNI NYC Homes - Agent Guide

## Project Overview

Professional property management company website for OMNI NYC Homes. Static React SPA showcasing real estate management services across NYC's five boroughs.

## Tech Stack

- **Framework**: React 18 + TypeScript (loose tsconfig, no strict mode)
- **Build**: Vite 5 with SWC plugin
- **Styling**: Tailwind CSS 3 + custom CSS variables (navy/gold/cream brand colors)
- **UI Components**: shadcn/ui (49 components, Radix UI primitives)
- **Routing**: react-router-dom v6 (BrowserRouter)
- **State**: useState + React Query (configured but unused — all data is static)
- **Testing**: Vitest + Testing Library + jsdom (configured, no tests written yet)
- **Icons**: lucide-react
- **Email**: nodemailer via Vercel serverless function
- **Deployment**: Vercel (SPA rewrites in vercel.json)

## Key Paths

```
src/
├── pages/          # Route pages (Index, About, Services, Contact, NotFound)
├── components/     # Layout, Navbar, Footer, NavLink
├── components/ui/  # shadcn/ui primitives (do not edit manually)
├── hooks/          # use-toast, use-mobile
├── lib/utils.ts    # cn() utility
├── assets/         # Static images (hero, about, logos)
├── index.css       # Global styles, CSS variables, font imports
└── App.tsx         # Router + QueryClient setup
api/
└── contact.ts      # Vercel serverless endpoint (nodemailer, rate-limited)
```

## Routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/pages/Index.tsx` | Home — hero, highlights, CTA |
| `/about` | `src/pages/About.tsx` | Company story, values, expertise |
| `/services` | `src/pages/Services.tsx` | 6 service offerings with hash scroll navigation |
| `/contact` | `src/pages/Contact.tsx` | Contact form (sends email via API) + contact info |
| `/staging`, `/staging/about`, `/staging/services`, `/staging/contact` | same page components | Visual preview of alternate styling — same components, different theme |
| `*` | `src/pages/NotFound.tsx` | 404 page |

## Commands

```bash
npm run dev          # Dev server on port 8080
npm run build        # Production build (outputs to dist/)
npm run preview      # Preview production build
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
```

## Architecture Notes

- **All page data is static** — hardcoded in page components. No database.
- **Contact form** submits to `/api/contact` (Vercel serverless function) which sends email via nodemailer (Namecheap email). Requires `NAMECHEAP_EMAIL` and `NAMECHEAP_EMAIL_PASSWORD` env vars.
- **Services page** supports hash-based smooth scrolling (e.g. `/services#building-maintenance`).
- **Path alias**: `@/*` maps to `./src/*`.
- **Brand fonts**: Playfair Display (headings via `font-display`), Source Sans 3 (body via `font-body`) — loaded from Google Fonts in index.css.
- **Brand colors**: navy (dark blue), gold (accent), cream (light backgrounds) — defined as CSS variables.
- **shadcn/ui components** are generated into `src/components/ui/` — modify via shadcn CLI, not by hand.
- **Navbar** is fixed with `pt-[72px]` offset on main content. Mobile has a hamburger menu.
- **Staging theme**: `/staging/*` routes render the same page components as the main routes. `ThemeProvider` (`src/components/ThemeProvider.tsx`) toggles a `staging` class on `<html>` and writes the active palette's CSS variables onto `document.documentElement` while on staging. Palettes live in `src/lib/staging-palettes.ts` (HSL "H S% L%" strings). The Navbar renders a `<select>` (in place of the tagline) on staging routes so the active palette can be switched at runtime; the choice persists in `localStorage` under `staging-palette-id`. Internal `Link`s use `useThemedPath()` (`src/hooks/use-themed-path.ts`) to stay within `/staging` while browsing. To add a new palette: append to the `palettes` array in `src/lib/staging-palettes.ts`.

## Staging-only changes

When the user says **"do on staging"**, **"only on staging"**, **"staging only"**, or any equivalent phrasing, scope changes to the `/staging/*` experience only — the default site at `/`, `/about`, etc. must remain unchanged.

Because staging routes share components with the main site, isolate changes with one of these patterns:
- **Color/style tweaks** — override CSS variables inside the `.staging { ... }` block in `src/index.css`. Do not edit the `:root` block.
- **Layout/markup/copy tweaks** — branch inside the affected component using `const { isStaging } = useThemedPath()` and render the alternate variant only when `isStaging` is true.
- **Staging-only assets/components** — fine to add new files; gate their usage behind `isStaging`.

Never duplicate a whole page just to differentiate staging — keep the single component, branch on `isStaging`.

## Conventions

- Tailwind utility classes for all styling (no CSS modules)
- Component files use PascalCase
- Pages are top-level route components in `src/pages/`
- Use `cn()` from `@/lib/utils` for conditional class merging
- Icons imported individually from `lucide-react`
