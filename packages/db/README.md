# @within/db

Supabase schema, RLS policies, seed data, and typed client for Within.

## Layout

```
supabase/
  migrations/0001_initial_schema.sql   All 26 tables, RLS policies, triggers, grants
  seed.sql                             Local/dev seed data (published, free-tier content)
src/
  types.ts   Hand-written Database types (Row/Insert/Update per table) for the Supabase client
  index.ts   createDbClient(url, anonKey) + re-exports of every type from types.ts
```

## Applying the schema

This package only contains the SQL; it does not run migrations itself. Using the
[Supabase CLI](https://supabase.com/docs/guides/cli) from this directory (`packages/db`):

```sh
supabase link --project-ref <your-project-ref>
supabase db push                 # applies supabase/migrations/0001_initial_schema.sql
supabase db execute -f supabase/seed.sql   # optional: load seed data
```

For local development, `supabase start` + `supabase db reset` will apply the migration and
`seed.sql` automatically.

## Admin model

There are no hard-coded admin emails anywhere in the schema. Whether a user is an admin is
determined entirely by a row existing in `admin_roles`. `is_admin(uid)` is a `security definer`
SQL function other tables' RLS policies call to check this without depending on `admin_roles`'
own (more restrictive) policies.

**Bootstrapping the first admin:** `admin_roles` policies require an existing admin to grant the
role to anyone else, so the very first row has nowhere to come from via the client. Insert it
once using the Supabase service role key (e.g. via the SQL editor in the dashboard, or any
service-role-authenticated client) — the service role bypasses RLS entirely. Every admin after
that can be granted through the normal authenticated flow.

## Content model

Every catalog/content table (`practice_sessions`, `silence_presets`, `inquiry_categories`,
`inquiry_cards`, `library_items`, `quotes`, `daily_schedule`, `common_space_rooms`,
`learn_series`, `learn_episodes`, `audio_talks`, `audio_series`, `audio_episodes`) has:

- `status`: `draft` | `scheduled` | `published` | `archived`
- `visibility`: `free` | `premium` | `inner_circle` | `invite_only`

Read access for `published` rows:

- `visibility = 'free'` — open to everyone, including signed-out (`anon`) requests.
- `visibility = 'inner_circle'` — requires an `active` row in `inner_circle_memberships`.
- `visibility = 'premium'` / `'invite_only'` — currently gated to "must be signed in" only.
  There is intentionally no payment or redemption-linked entitlement check yet (no Stripe, per
  the delivery rules, and `invite_codes` redemption doesn't yet grant ongoing access). Tightening
  this is deferred to whenever that entitlement model is designed.

`draft`/`scheduled`/`archived` rows are only visible to admins.

## Media assets

`media_assets` rows can't be deleted while a `published` row references them (checked by a
`before delete` trigger across every table with an asset reference). They *can* be deleted while
only referenced by `draft` content — the referencing column is nullable and falls back to `null`
in that case, since unpublished drafts are expected to be edited freely.

## Presence

`common_space_presence` only ever stores real rows written by signed-in users for their own
session. There is no seeded or computed fake online count anywhere — any "N people here" UI
must be a live `count()` against this table, never a hard-coded or randomized number.

## Guest / anonymous accounts

Supabase anonymous sign-in still creates a row in `auth.users`, so the existing
`handle_new_auth_user` trigger creates a matching `profiles` row (with `is_guest = true`) for
guests exactly the same way it does for permanent accounts. When a guest later links a real
identity (email/password, OAuth, etc.) via Supabase's anonymous-upgrade flow, `auth.users.id`
stays the same, so every row already created under that id (`session_logs`, `favorites`, etc.)
carries over automatically — no extra migration step needed. This is intentionally as far as
Phase 1 goes; no separate anonymous-only tables or flows were added.

## Types

`src/types.ts` defines `Row` / `Insert` / `Update` interfaces for every table plus a `Database`
type in the shape `@supabase/supabase-js` expects:

```ts
import { createDbClient } from "@within/db";

const db = createDbClient(supabaseUrl, supabaseAnonKey);
const { data } = await db.from("practice_sessions").select("*").eq("status", "published");
```

`ContentStatus` and `ContentVisibility` are defined once in `@within/validation` and reused here
rather than redeclared.
