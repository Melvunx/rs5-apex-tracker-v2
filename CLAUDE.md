# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npx prisma generate          # Regenerate Prisma client after schema changes
npx prisma migrate dev       # Create and apply a new migration
npx prisma studio            # Open Prisma Studio to inspect the database
```

No test suite is configured.

## Architecture

**R5 Apex Trainer v2** is a Next.js App Router application for tracking Apex Legends aim-trainer performance. Users import CSV results from an aim trainer, view stats/charts, and manage sensitivity settings.

### Path Aliases

Defined in `tsconfig.json`:
- `@/*` → `src/*`
- `@app/*` → `app/*`

### Route Structure

```
app/
  (protected)/          # Requires session (layout redirects to /login)
    (admin)/            # Requires role === "ADMIN"
    account/            # User profile management
    dashboard/          # Stats charts and challenge history
    sensitivity/        # Mouse/controller sensitivity settings
  api/auth/[...all]/    # Better Auth catch-all handler
  login/                # Public login page
  actions/              # Server Actions (auth, challenges, weapons, sensitivity, admin, imports)
```

### Authentication

Uses **Better Auth** (`src/lib/auth.ts` server, `src/lib/auth-client.ts` client). Social providers: Google OAuth and Discord OAuth. Sessions and accounts are stored in PostgreSQL via the Prisma adapter.

Middleware (`src/lib/middleware.ts`) handles role-based routing: unauthenticated requests to protected routes redirect to `/login`; non-admin requests to `(admin)` routes redirect to the dashboard.

### Database

**Prisma v7** with PostgreSQL (local default: `localhost:5433`, db `r5_apex_tracker`). Client output is at `app/generated/prisma` (not the default location — import from there, not `@prisma/client`).

Core app models:
- `Challenge` — aim-trainer session results (shots, kills, accuracy, damage, scenario, weapon)
- `Sensitivity` — per-user mouse/controller settings (DPI, curves, optics, ADS/hipfire)

Better Auth tables (`User`, `Account`, `Session`, `Verification`) are managed by the auth library; do not modify them manually.

### Data Import

CSV files must begin with the line `=== Aim Trainer v1.0 CSV Results Dump - Made by CafeFPS @CafeFPS ===`. Import logic lives in `app/actions/imports/`.

### UI

- **shadcn/ui** + **base-ui/react** for components; add new shadcn components with `npx shadcn add <component>`
- **Tailwind CSS v4** for styling
- **Recharts** for charts
- **Sonner** for toast notifications
- **next-themes** for light/dark mode
- All reusable UI primitives are in `src/components/ui/`; layout-level components are in `src/layout/`

### Zod Schemas

Validation schemas live in `src/schema/` and are shared between server actions and client forms.
