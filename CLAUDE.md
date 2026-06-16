# OMNI NYC Homes - Agent Guide

## ⚠️ Keep this file in sync

**Whenever you change the site, update this file in the same task.** This is a hard requirement, not optional. After editing any of the following, reflect the change here before finishing:
- **Routes / pages** → update the Routes table and Key Paths.
- **Components / hooks** → update the Components list and Key Paths.
- **Services, contact info, brand copy, colors, or assets** → update the Content & Brand Reference section.
- **Email / API behavior, env vars, build, or deploy config** → update Architecture Notes and Commands.
- **New conventions or patterns** → update Conventions.

Keep edits concise and factual — this file is the project's single source of truth for agents. If a change makes something here wrong, fix it; don't just append.

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
- **Email**: Microsoft Graph API (app-only OAuth2) via Vercel serverless functions
- **PDF**: `pdf-lib` + `@pdf-lib/fontkit` (jobs application is emailed as a generated PDF)
- **Deployment**: Vercel (SPA rewrites in vercel.json; `jobs.` subdomain serves a static form)

## Key Paths

```
src/
├── pages/          # Route pages (Index, About, Services, Contact, NotFound)
├── components/     # Layout, Navbar, Footer, NavLink, ScrollToTop
├── components/ui/  # shadcn/ui primitives (do not edit manually)
├── hooks/          # use-toast, use-mobile
├── lib/utils.ts    # cn() utility
├── assets/         # Static images (hero, about, logos)
├── index.css       # Global styles, CSS variables, font imports
└── App.tsx         # Router + QueryClient setup
public/
└── jobs.html       # Standalone employment-application form (served on the jobs. subdomain & /jobs)
api/
├── contact.ts      # Vercel serverless endpoint — contact form (Graph API, rate-limited)
└── apply.ts        # Vercel serverless endpoint — job application → PDF + email (Graph API, rate-limited)
```

### Components
- **Layout** — wraps `<Navbar /> <main pt-[72px] md:pt-[80px]> {children} </main> <Footer />`.
- **Navbar** — fixed, white bg, blur; logo (`omni_logo.png`) left, gold italic tagline "Built on Trust, Driven by Excellence." center, 4 nav links right; mobile hamburger.
- **Footer** — navy bg; brand + Quick Links + Services (hash anchors); dynamic copyright; Privacy Policy / Terms of Use open a `LegalModal`.
- **NavLink** — `forwardRef` wrapper over RR `NavLink`, composes `className`/`activeClassName`/`pendingClassName` via `cn()`.
- **ScrollToTop** — renders `null`; scrolls to top on pathname change (skips when a hash is present).

## Routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/pages/Index.tsx` | Home — hero, highlights, CTA |
| `/about` | `src/pages/About.tsx` | Company story, values, expertise |
| `/services` | `src/pages/Services.tsx` | 6 service offerings with hash scroll navigation |
| `/contact` | `src/pages/Contact.tsx` | Contact form (sends email via API) + contact info |
| `*` | `src/pages/NotFound.tsx` | 404 page |

**Jobs form** is **not** a React route — it's the standalone static page `public/jobs.html` (own styling, 5-language switcher EN/ES/RU/UK/KA, no navbar/footer). Served at the root of the `jobs.omnipropm.com` subdomain and at `/jobs` on the main site, via host/path rewrites in `vercel.json`. It posts to `/api/apply`.

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
- **Contact form** submits to `/api/contact` (Vercel serverless function) which sends email via the **Microsoft Graph API** (`/users/{mailbox}/sendMail`, app-only OAuth2 token from Entra ID). Requires `M365_TENANT_ID`, `M365_CLIENT_ID`, `M365_CLIENT_SECRET`, and `NAMECHEAP_EMAIL` (the licensed mailbox that sends, e.g. `info@omnipropm.com`) env vars. Optional `CONTACT_RECIPIENT` overrides the recipient (defaults to the mailbox itself) — used to redirect to a test inbox locally. Rate-limited to 3 requests per IP per 60s (in-memory). Field caps: name/email 200, subject 500, message 5000.
- **Local API testing**: `npm run dev` (Vite, port 8080) does **not** serve `/api/*`. Use `vercel dev` (serves app + functions on port 3000). The Graph *sender* must be a real licensed M365 mailbox — only the recipient can be changed for testing via `CONTACT_RECIPIENT`.
  - **Gotcha**: once the project is linked, `vercel dev` pulls the cloud *Development* env vars and **ignores `.env.local`**. Inject local secrets via the process env instead: `npx dotenv-cli -e .env.local -- vercel dev --listen 3000`. Verify with a temporary `api/*.ts` that echoes `process.env[...].length` (no underscore prefix — Vercel ignores `_`-prefixed api files).
  - The SPA rewrite in `vercel.json` is `/((?!api/|@|.*\.).*)` so it doesn't swallow Vite dev modules (`/src/*`, `/@vite/*`) under `vercel dev`.
- **Jobs application** (`public/jobs.html`) posts JSON to **`/api/apply`** (Vercel serverless function). The endpoint generates a PDF of the application with `pdf-lib` (Unicode font DejaVu Sans fetched once from jsDelivr and cached on the warm instance — covers Latin+Cyrillic; falls back to Helvetica with non-Latin chars stripped if the fetch fails) and emails it via the **Microsoft Graph API**, reusing the same env vars as `/api/contact` (`M365_TENANT_ID`, `M365_CLIENT_ID`, `M365_CLIENT_SECRET`, `NAMECHEAP_EMAIL`). The applicant's optional uploaded resume is attached as a second file. Recipient resolves to `JOBS_RECIPIENT` → `CONTACT_RECIPIENT` → the mailbox itself. Rate-limited 3/IP/60s. Caps: applicant name 200, section title 200, field label 200, field value 5000; resume base64 ≤ 4.4M chars (~3MB raw, kept under Vercel's ~4.5MB body limit — client also enforces a 3MB cap).
- **Subdomain routing** (`vercel.json`): a host rewrite serves `/jobs.html` at the root of `jobs.omnipropm.com`, and `/jobs` rewrites to it on any domain. Add `jobs.omnipropm.com` to this Vercel project + the DNS record in the dashboard; no separate project/deploy needed. The SPA catch-all rewrite stays last.
- **Services page** supports hash-based smooth scrolling (e.g. `/services#building-maintenance`).
- **Path alias**: `@/*` maps to `./src/*`.
- **Brand fonts**: Playfair Display (headings via `font-display`), Source Sans 3 (body via `font-body`) — loaded from Google Fonts in index.css.
- **Brand colors**: navy (dark blue), gold (accent), cream (light backgrounds) — defined as CSS variables.
- **shadcn/ui components** are generated into `src/components/ui/` — modify via shadcn CLI, not by hand.
- **Navbar** is fixed with `pt-[72px]` offset on main content. Mobile has a hamburger menu.

## Content & Brand Reference

**Services** (Services.tsx — name → hash id → lucide icon):
| Service | Hash id | Icon |
|---|---|---|
| Property Management | `property-management` | Building2 |
| Building Maintenance | `building-maintenance` | Wrench |
| Tenant Relations | `tenant-relations` | Users |
| Compliance & Safety | `compliance-safety` | Shield |
| 24/7 Emergency Response | `emergency-response` | Clock |
| Financial Management | `financial-management` | BarChart3 |

**Contact info** (hardcoded in Contact.tsx; address/phone/hours also implied elsewhere):
- Address: 224 W 35th St Ste 500, New York, NY 10001
- Phone: (212) 460-5000
- Email: info@omnipropm.com (mailto link)
- Hours: Mon–Fri: 8AM – 6PM

**Brand colors** (HSL CSS vars in `:root`, `src/index.css`):
- navy / primary: `220 50% 32%` (also `--navy-light: 220 35% 44%`)
- gold / accent: `24 100% 50%` (also `--gold-light: 24 85% 65%`)
- cream: `45 30% 95%`
- `--radius: 0.375rem`

**Active assets** (`src/assets/`): `omni_logo.png` (navbar), `omni_backgound.png` (Index hero bg), `about-building.jpg` (About). Unused: `hero-nyc.jpeg`, `logo.png/.svg`, `logo-bg.png/.svg`, `logo-staging.png`.

**Key copy**: Home hero — "Elevating the Standard of Property Management"; tagline "Built on Trust, Driven by Excellence."; "AAA Service Standard" / AAA-level service is a recurring brand phrase. Company is "OMNI Management LLC", founded by NYC real-estate veterans, serving all five boroughs.

## Conventions

- Tailwind utility classes for all styling (no CSS modules)
- Component files use PascalCase
- Pages are top-level route components in `src/pages/`
- Use `cn()` from `@/lib/utils` for conditional class merging
- Icons imported individually from `lucide-react`
