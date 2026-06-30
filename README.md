# Within

Within is a mobile-first meditation, silence, inquiry, and inner-practice platform.

## Project Structure

```
apps/
  mobile/      Expo Router + React Native consumer app
  admin/       Next.js App Router admin console
  marketing/   Next.js App Router marketing site
packages/
  db/          Supabase schema, RLS, seed data, and typed client (see packages/db/README.md)
  ui/          Shared React UI components
  config/      Shared configuration and constants (e.g. admin nav)
  validation/  Shared content status/visibility types and validators
  audio/       Shared audio engine for guided practice and silence sessions
  analytics/   Shared analytics event types
```

Every package exposes its public API through `src/index.ts` (or `src/index.tsx` for `@within/ui`,
which exports React components) and is consumed directly as TypeScript source — apps transpile
workspace packages themselves (see `transpilePackages` in each Next.js app's `next.config.ts`).

## Setup

1. Install [pnpm](https://pnpm.io) (pinned via `devEngines.packageManager` in [package.json](package.json)).
2. Run `pnpm install` from the repo root.
3. Copy each `.env.example` to `.env` and fill in real values:
   - [.env.example](.env.example) — shared values
   - [apps/mobile/.env.example](apps/mobile/.env.example)
   - [apps/admin/.env.example](apps/admin/.env.example)
   - [apps/marketing/.env.example](apps/marketing/.env.example)

Never commit a populated `.env` file. Only `.env.example` files are tracked.

## Scripts

Run from the repo root:

```powershell
pnpm install        # install all workspace dependencies
pnpm lint            # lint every package/app that defines a lint script
pnpm typecheck       # typecheck every package/app that defines a typecheck script
pnpm build           # build every package/app that defines a build script
pnpm format          # format the repo with Prettier
pnpm dev:mobile      # alias for `pnpm --filter mobile start`
pnpm dev:admin       # alias for `pnpm --filter admin dev`
pnpm dev:marketing   # alias for `pnpm --filter marketing dev`
```

You can also target a single workspace directly, e.g. `pnpm --filter mobile start`.

## Conventions

- Package manager: `pnpm` only (see Delivery Rules in `VP_DELIVERY_WORK_ORDER.md`).
- TypeScript `strict` everywhere, via [tsconfig.base.json](tsconfig.base.json).
- `apps/admin` and `apps/marketing` are Next.js App Router apps; `apps/mobile` is Expo Router.
- `apps/mobile/AGENTS.md` requires checking the Expo SDK 56 docs before changing Expo code.
- No Stripe integration, no Anthropic/Claude integration, no fake presence/online counts.
