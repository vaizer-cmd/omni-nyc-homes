# OMNI NYC Homes - Agent Guide

## Project Overview

Professional property management company website for OMNI NYC Homes. Static React SPA showcasing real estate management services across NYC's five boroughs.

## Tech Stack

- **Framework**: React 18 + TypeScript (loose tsconfig, no strict mode)
- **Build**: Vite 5 with SWC plugin
- **Styling**: Tailwind CSS 3 + custom CSS variables (navy/gold/cream brand colors)
- **UI Components**: shadcn/ui (49 components, Radix UI primitives)
- **Routing**: react-router-dom v6 (BrowserRouter)
- **State**: useState + React Query (no global store)
- **Testing**: Vitest + Testing Library + jsdom
- **Icons**: lucide-react
- **Deployment**: GitHub Pages via GitHub Actions

## Key Paths

```
src/
├── pages/          # Route pages (Index, About, Properties, Services, Contact, NotFound)
├── components/     # Layout, Navbar, Footer, NavLink
├── components/ui/  # shadcn/ui primitives (do not edit manually)
├── hooks/          # use-toast, use-mobile
├── lib/utils.ts    # cn() utility
├── assets/         # Static images (hero, properties, about)
├── index.css       # Global styles, CSS variables, font imports
└── App.tsx         # Router + QueryClient setup
```

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

- **All data is static** — hardcoded in page components. No API or database.
- **Contact form** shows a toast on submit but doesn't send data anywhere.
- **Base path** is `/omni-nyc-homes/` for GitHub Pages deployment.
- **Path alias**: `@/*` maps to `./src/*`.
- **Brand fonts**: Playfair Display (headings), Source Sans 3 (body) — loaded from Google Fonts in index.css.
- **shadcn/ui components** are generated into `src/components/ui/` — modify via shadcn CLI, not by hand.

## Conventions

- Tailwind utility classes for all styling (no CSS modules)
- Component files use PascalCase
- Pages are top-level route components in `src/pages/`
- Use `cn()` from `@/lib/utils` for conditional class merging
- Icons imported individually from `lucide-react`
