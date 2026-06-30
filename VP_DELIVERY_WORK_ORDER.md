# Within Delivery Work Order

Role: implementation employee / engineering owner
Reviewer: Codex acting as VP IT delivery reviewer
Project: Within, a mobile-first meditation, silence, inquiry, and inner-practice platform

## Current Workspace Status

The workspace is not empty.

- Root path: `C:\Projects\within`
- Existing root package: `package.json`
- Existing mobile app: `apps/mobile`
- Existing mobile stack: Expo Router, React Native, TypeScript
- Existing mobile tabs are still starter screens: `Tab One` and `Tab Two`
- Existing strict TypeScript is enabled only inside `apps/mobile/tsconfig.json`
- Existing folders present: `apps`, `packages`, `node_modules`
- Missing apps: `apps/admin`, `apps/marketing`
- Missing package workspaces: `packages/db`, `packages/ui`, `packages/config`, `packages/validation`, `packages/audio`, `packages/analytics`
- Missing foundation files: `pnpm-workspace.yaml`, root TypeScript config, ESLint config, Prettier config, `.gitignore`, `.env.example`, root `README.md`

Important: `apps/mobile/AGENTS.md` says to read Expo SDK 56 docs before changing Expo code. Follow the installed package versions and do not downgrade Expo.

## Delivery Rules

- Use `pnpm` only.
- Keep TypeScript strict everywhere.
- Do not commit secrets.
- Do not integrate Stripe.
- Do not integrate Anthropic or Claude.
- Do not show fake online counts or fake presence.
- Do not hard-code production content inside frontend components.
- Temporary mock content is allowed only in seed/mock adapters.
- Shared packages must be importable by apps.
- Build native-first through Expo Router for the consumer app.
- Admin and marketing must be Next.js apps.

## Package Manager And Commands

Use these commands from the repo root:

```powershell
pnpm install
pnpm lint
pnpm typecheck
pnpm build
pnpm --filter mobile start
pnpm --filter admin dev
pnpm --filter marketing dev
```

If a command does not exist yet, create the script first instead of skipping verification.

## Phase 0: Repo Foundation

Phase 0 is the immediate assignment. Complete this before building product flows.

### Files And Folders To Create Or Update

Create or update:

- `pnpm-workspace.yaml`
- `package.json`
- `tsconfig.base.json`
- `.gitignore`
- `.prettierrc`
- `.prettierignore`
- `eslint.config.js`
- `.env.example`
- `README.md`
- `apps/mobile/.env.example`
- `apps/admin/.env.example`
- `apps/marketing/.env.example`
- `apps/admin/package.json`
- `apps/admin/tsconfig.json`
- `apps/admin/next.config.ts`
- `apps/admin/app/layout.tsx`
- `apps/admin/app/page.tsx`
- `apps/marketing/package.json`
- `apps/marketing/tsconfig.json`
- `apps/marketing/next.config.ts`
- `apps/marketing/app/layout.tsx`
- `apps/marketing/app/page.tsx`
- `packages/db/package.json`
- `packages/db/tsconfig.json`
- `packages/db/src/index.ts`
- `packages/ui/package.json`
- `packages/ui/tsconfig.json`
- `packages/ui/src/index.ts`
- `packages/config/package.json`
- `packages/config/tsconfig.json`
- `packages/config/src/index.ts`
- `packages/validation/package.json`
- `packages/validation/tsconfig.json`
- `packages/validation/src/index.ts`
- `packages/audio/package.json`
- `packages/audio/tsconfig.json`
- `packages/audio/src/index.ts`
- `packages/analytics/package.json`
- `packages/analytics/tsconfig.json`
- `packages/analytics/src/index.ts`

### Root Workspace Requirements

`pnpm-workspace.yaml` must include:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Root `package.json` must include:

- `"private": true`
- `scripts.lint`
- `scripts.typecheck`
- `scripts.build`
- `scripts.format`
- `scripts.dev:mobile`
- `scripts.dev:admin`
- `scripts.dev:marketing`

Root `.gitignore` must ignore:

- `node_modules`
- `.expo`
- `.next`
- `dist`
- `build`
- `.turbo`
- `.env`
- `.env.*`
- `!.env.example`

Every package must expose its public API through `src/index.ts`.

### Admin And Marketing Foundation

Create basic Next.js App Router apps:

- `apps/admin`
- `apps/marketing`

For now they can be minimal, but they must:

- Compile with strict TypeScript.
- Run with `pnpm --filter admin dev`.
- Run with `pnpm --filter marketing dev`.
- Use App Router.
- Avoid authentication implementation until the backend role model exists.

Admin placeholder navigation must include these labels:

- Dashboard
- Media
- Guided Practices
- Silence
- Inquiry
- Library
- Daily Schedule
- Learn
- Audio Talks
- Common Space Rooms
- Inner Circle
- Feedback
- Analytics

### Phase 0 Acceptance Criteria

Phase 0 is done only when:

- `pnpm install` succeeds.
- `pnpm lint` succeeds.
- `pnpm typecheck` succeeds.
- `pnpm build` succeeds or all build blockers are documented with exact errors.
- `apps/mobile`, `apps/admin`, and `apps/marketing` each have runnable scripts.
- Shared packages can be imported by at least one app or by TypeScript without path errors.
- Root `README.md` explains setup, env files, scripts, and project structure.
- No secret values are committed.

## Phase 1: Backend Foundation

Start Phase 1 only after Phase 0 passes review.

### Files To Create

Create inside `packages/db`:

- `supabase/migrations/0001_initial_schema.sql`
- `supabase/seed.sql`
- `src/types.ts`
- `src/index.ts`
- `README.md`

### Schema Tables

Create migrations for:

- `profiles`
- `user_preferences`
- `admin_roles`
- `media_assets`
- `practice_sessions`
- `silence_presets`
- `inquiry_categories`
- `inquiry_cards`
- `library_items`
- `quotes`
- `daily_schedule`
- `feeling_checkins`
- `session_logs`
- `user_progress`
- `favorites`
- `common_space_rooms`
- `common_space_presence`
- `learn_series`
- `learn_episodes`
- `audio_talks`
- `audio_series`
- `audio_episodes`
- `inner_circle_memberships`
- `invite_codes`
- `feedback_messages`
- `admin_audit_log`

### Schema Rules

- Use UUID primary keys.
- Add `created_at` and `updated_at` to every table.
- Enable RLS on every table.
- Do not hard-code admin emails.
- Admin authorization must come from `admin_roles`.
- Content tables need `status`: `draft`, `scheduled`, `published`, `archived`.
- Content tables need `visibility`: `free`, `premium`, `inner_circle`, `invite_only`.
- Plan guest migration, but do not overbuild anonymous-user behavior.
- Use public media URLs for public free content.
- Prepare private Inner Circle media for signed URLs later.
- Media assets must not be deletable if referenced by published content.

### Seed Data

Create seed data for:

- 5 guided practices
- 3 silence presets
- 5 inquiry categories
- 20 inquiry cards
- 20 library quote cards
- 10 quotes of the day
- 4 public Common Space rooms
- 3 Learn series
- 5 audio talks

### Phase 1 Acceptance Criteria

Phase 1 is done only when:

- Migration file exists and is readable from `packages/db`.
- Seed file exists and contains the required counts.
- RLS is enabled for every table.
- Admin policies reference `admin_roles`, not email addresses.
- Public room seed data includes no fake presence counts.
- Type exports exist for app consumption.

## Phase 2: First Real Vertical Slice

Start Phase 2 only after Phase 1 passes review.

### Mobile Flow To Build

Build this route:

Home -> Start Meditation -> Guided Practice Detail -> Audio Session Screen -> Completion Screen

The flow must:

- Use seeded/mock data through a replaceable adapter.
- Be Supabase-ready without requiring credentials.
- Save progress locally for now.
- Keep future Supabase persistence isolated behind an interface.

### Mobile Tabs

The app must have exactly 3 tabs:

- Home
- Explore
- Profile

Home must include:

- Start Meditation
- Guided Practices
- Silence
- Inquiry
- Library
- Quote of the Day
- Feeling Check-in
- Continue Where You Left Off

Explore must include:

- Common Space
- Learn
- Inner Circle
- Audio Talks / Series

Profile must include:

- Current streak
- Total meditation time
- Total silence time
- Completed sessions
- Inquiry progress
- Saved content
- Feeling history
- Practice history
- Settings

### Audio Engine

Create the audio module inside `packages/audio`.

Rules:

- One audio engine module.
- One audio instance/state machine.
- Support `play`, `pause`, `resume`, and `stop`.
- Prepare for voice audio plus background audio.
- Do not create competing audio players.

### Mobile UI Rules

- Minimal, premium, monochrome design.
- No noisy gamification.
- No badges.
- No fake numbers.
- No raw technical errors shown to users.
- All screens need calm empty and error states.

### Phase 2 Acceptance Criteria

Phase 2 is done only when:

- Mobile has Home, Explore, Profile tabs.
- Home content matches the required list.
- Start Meditation flow works from Home through Completion.
- Progress is saved locally.
- Mock/seed adapter is isolated from UI components.
- Audio control uses `packages/audio`.
- No Stripe integration exists.
- No Anthropic integration exists.
- No fake presence numbers exist.

## Review Protocol

When you finish a phase, report:

1. Exact files changed.
2. Commands run.
3. Command results.
4. Any blockers.
5. Anything intentionally deferred.

Do not proceed to the next phase until review is complete.

