# Copilot Instructions — OMNI NYC Homes

## Project

Static React SPA for a NYC property management company. Built with React 18, TypeScript, Vite 5, Tailwind CSS 3, and shadcn/ui. Deployed on Vercel.

## Stack & Patterns

- **Routing**: react-router-dom v6 with BrowserRouter. Routes defined in `src/App.tsx`.
- **Styling**: Tailwind utility classes only. Brand colors defined as CSS variables in `src/index.css` (navy, gold, cream). Use `cn()` from `@/lib/utils` for conditional classes.
- **Components**: shadcn/ui in `src/components/ui/` — don't edit these directly. App-level components in `src/components/`.
- **State**: Local `useState` for UI state. React Query (`@tanstack/react-query`) is configured but all data is currently static/hardcoded.
- **Path alias**: `@/*` → `./src/*`
- **Icons**: Import individually from `lucide-react`.
- **Email**: Contact form submits to `/api/contact` (Vercel serverless function using nodemailer).

## Code Style

- PascalCase for component files and names
- Functional components with arrow functions
- Tailwind classes inline (no CSS modules)
- TypeScript with loose checking (no strict mode)

## Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/pages/Index.tsx` | Home — hero, highlights, CTA |
| `/about` | `src/pages/About.tsx` | Company story, values, expertise |
| `/services` | `src/pages/Services.tsx` | 6 service offerings with hash scroll |
| `/contact` | `src/pages/Contact.tsx` | Contact form + info |
| `*` | `src/pages/NotFound.tsx` | 404 page |

## Testing

Vitest + Testing Library. Config in `vitest.config.ts`, setup in `src/test/setup.ts`. Run with `npm run test`.

## Build & Deploy

- `npm run build` outputs to `dist/`
- Deployed on Vercel with SPA rewrites (`vercel.json`)
- API endpoint: `api/contact.ts` (serverless function)
