# Copilot Instructions — OMNI NYC Homes

## Project

Static React SPA for a NYC property management company. Built with React 18, TypeScript, Vite 5, Tailwind CSS 3, and shadcn/ui.

## Stack & Patterns

- **Routing**: react-router-dom v6 with BrowserRouter. Routes defined in `src/App.tsx`.
- **Styling**: Tailwind utility classes only. Brand colors defined as CSS variables in `src/index.css` (navy, gold, cream). Use `cn()` from `@/lib/utils` for conditional classes.
- **Components**: shadcn/ui in `src/components/ui/` — don't edit these directly. App-level components in `src/components/`.
- **State**: Local `useState` for UI state. React Query (`@tanstack/react-query`) is configured but all data is currently static/hardcoded.
- **Path alias**: `@/*` → `./src/*`
- **Icons**: Import individually from `lucide-react`.

## Code Style

- PascalCase for component files and names
- Functional components with arrow functions
- Tailwind classes inline (no CSS modules)
- TypeScript with loose checking (no strict mode)

## Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/pages/Index.tsx` | Home — hero, stats, highlights |
| `/about` | `src/pages/About.tsx` | Company story, values, expertise |
| `/properties` | `src/pages/Properties.tsx` | Property portfolio cards |
| `/services` | `src/pages/Services.tsx` | Service offerings |
| `/contact` | `src/pages/Contact.tsx` | Contact form + info |
| `*` | `src/pages/NotFound.tsx` | 404 page |

## Testing

Vitest + Testing Library. Tests in `src/test/`. Run with `npm run test`.

## Build & Deploy

- `npm run build` outputs to `dist/`
- Deployed to GitHub Pages with base path `/omni-nyc-homes/`
- CI/CD via `.github/workflows/deploy.yml`
