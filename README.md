# OMNI NYC Homes

Professional property management website for OMNI Property Management LLC, serving all five boroughs of New York City.

## Tech Stack

- React 18 + TypeScript
- Vite 5 (SWC)
- Tailwind CSS 3 + shadcn/ui
- react-router-dom v6
- Vercel (hosting + serverless API)

## Getting Started

```bash
npm install
npm run dev        # Dev server at http://localhost:8080
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (Vitest) |

## Environment Variables

Required for the contact form email functionality (set in Vercel):

- `NAMECHEAP_EMAIL` — Sender email address
- `NAMECHEAP_EMAIL_PASSWORD` — Email password

## Deployment

Deployed on Vercel. Push to `main` triggers automatic deployment.
