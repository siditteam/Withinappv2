-- Within: initial schema (Phase 1 backend foundation)
-- Tables, RLS, and the admin/content model described in VP_DELIVERY_WORK_ORDER.md.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enum types
-- ---------------------------------------------------------------------------

create type content_status as enum ('draft', 'scheduled', 'published', 'archived');
create type content_visibility as enum ('free', 'premium', 'inner_circle', 'invite_only');

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- security definer: lets RLS policies on other tables check admin status
-- without depending on admin_roles' own (more restrictive) RLS policies.
-- plpgsql instead of sql so the referenced tables don't need to exist at
-- definition time -- sql-language bodies are validated against the catalog
-- when the function is created, plpgsql bodies are not.
create or replace function is_admin(uid uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from admin_roles ar where ar.user_id = uid
  );
end;
$$;

create or replace function has_inner_circle_access(uid uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from inner_circle_memberships m
    where m.user_id = uid and m.status = 'active'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  bio text,
  avatar_media_id uuid,
  is_guest boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles (id) on delete cascade,
  theme text not null default 'system' check (theme in ('system', 'light', 'dark')),
  reminder_enabled boolean not null default false,
  reminder_time time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table admin_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles (id) on delete cascade,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  granted_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table media_assets (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('audio', 'image', 'video')),
  storage_path text not null,
  public_url text,
  visibility content_visibility not null default 'free',
  duration_seconds integer,
  uploaded_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles
  add constraint profiles_avatar_media_id_fkey
  foreign key (avatar_media_id) references media_assets (id) on delete set null;

create table practice_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  meaning text not null,
  motive text not null,
  completion_suggestion text,
  audio_asset_id uuid references media_assets (id) on delete set null,
  cover_asset_id uuid references media_assets (id) on delete set null,
  duration_seconds integer not null,
  status content_status not null default 'draft',
  visibility content_visibility not null default 'free',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table silence_presets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  duration_seconds integer not null,
  ambient_audio_asset_id uuid references media_assets (id) on delete set null,
  bell_interval_seconds integer,
  status content_status not null default 'draft',
  visibility content_visibility not null default 'free',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table inquiry_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status content_status not null default 'draft',
  visibility content_visibility not null default 'free',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table inquiry_cards (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references inquiry_categories (id) on delete cascade,
  prompt text not null,
  question text,
  answer text,
  explanation text,
  reflection_prompt text,
  mood_relevance text[] not null default '{}',
  status content_status not null default 'draft',
  visibility content_visibility not null default 'free',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table library_items (
  id uuid primary key default gen_random_uuid(),
  title text,
  body text not null,
  author text,
  meaning text,
  deeper_explanation text,
  related_inquiry_card_id uuid references inquiry_cards (id) on delete set null,
  status content_status not null default 'draft',
  visibility content_visibility not null default 'free',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table quotes (
  id uuid primary key default gen_random_uuid(),
  body text not null,
  author text,
  display_date date,
  status content_status not null default 'draft',
  visibility content_visibility not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table daily_schedule (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  scheduled_at timestamptz not null,
  reference_type text check (reference_type in ('practice_session', 'silence_preset', 'audio_talk', 'learn_episode')),
  reference_id uuid,
  status content_status not null default 'draft',
  visibility content_visibility not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table feeling_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  feeling text not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table session_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  practice_session_id uuid references practice_sessions (id) on delete set null,
  silence_preset_id uuid references silence_presets (id) on delete set null,
  kind text not null check (kind in ('practice', 'silence')),
  duration_seconds integer not null,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles (id) on delete cascade,
  current_streak_days integer not null default 0,
  total_meditation_seconds integer not null default 0,
  total_silence_seconds integer not null default 0,
  completed_sessions_count integer not null default 0,
  last_practiced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  content_type text not null check (
    content_type in ('practice_session', 'silence_preset', 'inquiry_card', 'library_item', 'audio_talk', 'learn_episode')
  ),
  content_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, content_type, content_id)
);

create table common_space_rooms (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  room_type text not null default 'silence' check (room_type in ('silence', 'guided_practice', 'live_guided')),
  is_public boolean not null default true,
  duration_seconds integer,
  purpose text,
  practice_session_id uuid references practice_sessions (id) on delete set null,
  status content_status not null default 'draft',
  visibility content_visibility not null default 'free',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table common_space_presence (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references common_space_rooms (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (room_id, user_id)
);

create table learn_series (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_asset_id uuid references media_assets (id) on delete set null,
  status content_status not null default 'draft',
  visibility content_visibility not null default 'free',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table learn_episodes (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references learn_series (id) on delete cascade,
  title text not null,
  audio_asset_id uuid references media_assets (id) on delete set null,
  duration_seconds integer,
  episode_number integer not null default 1,
  status content_status not null default 'draft',
  visibility content_visibility not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table audio_talks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  speaker text,
  audio_asset_id uuid references media_assets (id) on delete set null,
  duration_seconds integer,
  status content_status not null default 'draft',
  visibility content_visibility not null default 'free',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table audio_series (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_asset_id uuid references media_assets (id) on delete set null,
  status content_status not null default 'draft',
  visibility content_visibility not null default 'free',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table audio_episodes (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references audio_series (id) on delete cascade,
  title text not null,
  audio_asset_id uuid references media_assets (id) on delete set null,
  duration_seconds integer,
  episode_number integer not null default 1,
  status content_status not null default 'draft',
  visibility content_visibility not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table inner_circle_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'revoked')),
  granted_by uuid references profiles (id) on delete set null,
  granted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  created_by uuid references profiles (id) on delete set null,
  redeemed_by uuid references profiles (id) on delete set null,
  redeemed_at timestamptz,
  expires_at timestamptz,
  max_uses integer not null default 1,
  use_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table feedback_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  message text not null,
  status text not null default 'open' check (status in ('open', 'reviewed', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles (id) on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers (every table)
-- ---------------------------------------------------------------------------

create trigger trg_profiles_set_updated_at before update on profiles for each row execute function set_updated_at();
create trigger trg_user_preferences_set_updated_at before update on user_preferences for each row execute function set_updated_at();
create trigger trg_admin_roles_set_updated_at before update on admin_roles for each row execute function set_updated_at();
create trigger trg_media_assets_set_updated_at before update on media_assets for each row execute function set_updated_at();
create trigger trg_practice_sessions_set_updated_at before update on practice_sessions for each row execute function set_updated_at();
create trigger trg_silence_presets_set_updated_at before update on silence_presets for each row execute function set_updated_at();
create trigger trg_inquiry_categories_set_updated_at before update on inquiry_categories for each row execute function set_updated_at();
create trigger trg_inquiry_cards_set_updated_at before update on inquiry_cards for each row execute function set_updated_at();
create trigger trg_library_items_set_updated_at before update on library_items for each row execute function set_updated_at();
create trigger trg_quotes_set_updated_at before update on quotes for each row execute function set_updated_at();
create trigger trg_daily_schedule_set_updated_at before update on daily_schedule for each row execute function set_updated_at();
create trigger trg_feeling_checkins_set_updated_at before update on feeling_checkins for each row execute function set_updated_at();
create trigger trg_session_logs_set_updated_at before update on session_logs for each row execute function set_updated_at();
create trigger trg_user_progress_set_updated_at before update on user_progress for each row execute function set_updated_at();
create trigger trg_favorites_set_updated_at before update on favorites for each row execute function set_updated_at();
create trigger trg_common_space_rooms_set_updated_at before update on common_space_rooms for each row execute function set_updated_at();
create trigger trg_common_space_presence_set_updated_at before update on common_space_presence for each row execute function set_updated_at();
create trigger trg_learn_series_set_updated_at before update on learn_series for each row execute function set_updated_at();
create trigger trg_learn_episodes_set_updated_at before update on learn_episodes for each row execute function set_updated_at();
create trigger trg_audio_talks_set_updated_at before update on audio_talks for each row execute function set_updated_at();
create trigger trg_audio_series_set_updated_at before update on audio_series for each row execute function set_updated_at();
create trigger trg_audio_episodes_set_updated_at before update on audio_episodes for each row execute function set_updated_at();
create trigger trg_inner_circle_memberships_set_updated_at before update on inner_circle_memberships for each row execute function set_updated_at();
create trigger trg_invite_codes_set_updated_at before update on invite_codes for each row execute function set_updated_at();
create trigger trg_feedback_messages_set_updated_at before update on feedback_messages for each row execute function set_updated_at();
create trigger trg_admin_audit_log_set_updated_at before update on admin_audit_log for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- New auth.users -> profiles (covers guest/anonymous sign-in too)
-- ---------------------------------------------------------------------------

create or replace function handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, is_guest)
  values (new.id, new.raw_user_meta_data ->> 'display_name', coalesce(new.is_anonymous, false));
  return new;
end;
$$;

create trigger trg_handle_new_auth_user
after insert on auth.users
for each row execute function handle_new_auth_user();

-- ---------------------------------------------------------------------------
-- Media assets must not be deletable while referenced by published content.
-- (Draft-only references are fine to leave dangling -> on delete set null.)
-- ---------------------------------------------------------------------------

create or replace function prevent_delete_of_published_media_asset()
returns trigger
language plpgsql
as $$
begin
  if exists (select 1 from practice_sessions where (audio_asset_id = old.id or cover_asset_id = old.id) and status = 'published')
    or exists (select 1 from silence_presets where ambient_audio_asset_id = old.id and status = 'published')
    or exists (select 1 from learn_series where cover_asset_id = old.id and status = 'published')
    or exists (select 1 from learn_episodes where audio_asset_id = old.id and status = 'published')
    or exists (select 1 from audio_talks where audio_asset_id = old.id and status = 'published')
    or exists (select 1 from audio_series where cover_asset_id = old.id and status = 'published')
    or exists (select 1 from audio_episodes where audio_asset_id = old.id and status = 'published')
  then
    raise exception 'media_assets % is referenced by published content and cannot be deleted', old.id;
  end if;
  return old;
end;
$$;

create trigger trg_media_assets_protect_published
before delete on media_assets
for each row execute function prevent_delete_of_published_media_asset();

-- ---------------------------------------------------------------------------
-- Grants. RLS policies (below) are the real gate; without these grants the
-- roles can't reach the tables at all, regardless of policy.
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
alter default privileges in schema public grant select on tables to anon, authenticated;
alter default privileges in schema public grant insert, update, delete on tables to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table profiles enable row level security;
alter table user_preferences enable row level security;
alter table admin_roles enable row level security;
alter table media_assets enable row level security;
alter table practice_sessions enable row level security;
alter table silence_presets enable row level security;
alter table inquiry_categories enable row level security;
alter table inquiry_cards enable row level security;
alter table library_items enable row level security;
alter table quotes enable row level security;
alter table daily_schedule enable row level security;
alter table feeling_checkins enable row level security;
alter table session_logs enable row level security;
alter table user_progress enable row level security;
alter table favorites enable row level security;
alter table common_space_rooms enable row level security;
alter table common_space_presence enable row level security;
alter table learn_series enable row level security;
alter table learn_episodes enable row level security;
alter table audio_talks enable row level security;
alter table audio_series enable row level security;
alter table audio_episodes enable row level security;
alter table inner_circle_memberships enable row level security;
alter table invite_codes enable row level security;
alter table feedback_messages enable row level security;
alter table admin_audit_log enable row level security;

-- profiles: self-service + admin oversight
create policy profiles_select on profiles for select to authenticated
  using (auth.uid() = id or is_admin(auth.uid()));
create policy profiles_insert on profiles for insert to authenticated
  with check (auth.uid() = id);
create policy profiles_update on profiles for update to authenticated
  using (auth.uid() = id or is_admin(auth.uid()))
  with check (auth.uid() = id or is_admin(auth.uid()));

-- user_preferences: owner-managed only
create policy user_preferences_all on user_preferences for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- admin_roles: admins manage the roster; a user can see their own row
create policy admin_roles_select on admin_roles for select to authenticated
  using (auth.uid() = user_id or is_admin(auth.uid()));
create policy admin_roles_write on admin_roles for insert to authenticated
  with check (is_admin(auth.uid()));
create policy admin_roles_update on admin_roles for update to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy admin_roles_delete on admin_roles for delete to authenticated
  using (is_admin(auth.uid()));
-- Note: the very first admin_roles row has no existing admin to grant it,
-- so it must be inserted with the Supabase service role (bypasses RLS).

-- media_assets
create policy media_assets_select_public on media_assets for select to anon, authenticated
  using (visibility = 'free');
create policy media_assets_select_inner_circle on media_assets for select to authenticated
  using (visibility = 'inner_circle' and has_inner_circle_access(auth.uid()));
create policy media_assets_select_gated on media_assets for select to authenticated
  using (visibility in ('premium', 'invite_only'));
create policy media_assets_admin_all on media_assets for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- Reusable content-table policy shape: public free content is readable by
-- anyone, inner_circle content requires an active membership, premium and
-- invite_only are gated to "must be signed in" for now (no entitlement
-- table exists yet for those tiers), and admins manage everything.
create policy practice_sessions_select_public on practice_sessions for select to anon, authenticated
  using (status = 'published' and visibility = 'free');
create policy practice_sessions_select_inner_circle on practice_sessions for select to authenticated
  using (status = 'published' and visibility = 'inner_circle' and has_inner_circle_access(auth.uid()));
create policy practice_sessions_select_gated on practice_sessions for select to authenticated
  using (status = 'published' and visibility in ('premium', 'invite_only'));
create policy practice_sessions_admin_all on practice_sessions for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

create policy silence_presets_select_public on silence_presets for select to anon, authenticated
  using (status = 'published' and visibility = 'free');
create policy silence_presets_select_inner_circle on silence_presets for select to authenticated
  using (status = 'published' and visibility = 'inner_circle' and has_inner_circle_access(auth.uid()));
create policy silence_presets_select_gated on silence_presets for select to authenticated
  using (status = 'published' and visibility in ('premium', 'invite_only'));
create policy silence_presets_admin_all on silence_presets for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

create policy inquiry_categories_select_public on inquiry_categories for select to anon, authenticated
  using (status = 'published' and visibility = 'free');
create policy inquiry_categories_select_inner_circle on inquiry_categories for select to authenticated
  using (status = 'published' and visibility = 'inner_circle' and has_inner_circle_access(auth.uid()));
create policy inquiry_categories_select_gated on inquiry_categories for select to authenticated
  using (status = 'published' and visibility in ('premium', 'invite_only'));
create policy inquiry_categories_admin_all on inquiry_categories for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

create policy inquiry_cards_select_public on inquiry_cards for select to anon, authenticated
  using (status = 'published' and visibility = 'free');
create policy inquiry_cards_select_inner_circle on inquiry_cards for select to authenticated
  using (status = 'published' and visibility = 'inner_circle' and has_inner_circle_access(auth.uid()));
create policy inquiry_cards_select_gated on inquiry_cards for select to authenticated
  using (status = 'published' and visibility in ('premium', 'invite_only'));
create policy inquiry_cards_admin_all on inquiry_cards for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

create policy library_items_select_public on library_items for select to anon, authenticated
  using (status = 'published' and visibility = 'free');
create policy library_items_select_inner_circle on library_items for select to authenticated
  using (status = 'published' and visibility = 'inner_circle' and has_inner_circle_access(auth.uid()));
create policy library_items_select_gated on library_items for select to authenticated
  using (status = 'published' and visibility in ('premium', 'invite_only'));
create policy library_items_admin_all on library_items for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

create policy quotes_select_public on quotes for select to anon, authenticated
  using (status = 'published' and visibility = 'free');
create policy quotes_select_inner_circle on quotes for select to authenticated
  using (status = 'published' and visibility = 'inner_circle' and has_inner_circle_access(auth.uid()));
create policy quotes_select_gated on quotes for select to authenticated
  using (status = 'published' and visibility in ('premium', 'invite_only'));
create policy quotes_admin_all on quotes for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

create policy daily_schedule_select_public on daily_schedule for select to anon, authenticated
  using (status = 'published' and visibility = 'free');
create policy daily_schedule_select_inner_circle on daily_schedule for select to authenticated
  using (status = 'published' and visibility = 'inner_circle' and has_inner_circle_access(auth.uid()));
create policy daily_schedule_select_gated on daily_schedule for select to authenticated
  using (status = 'published' and visibility in ('premium', 'invite_only'));
create policy daily_schedule_admin_all on daily_schedule for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- Rooms additionally require is_public = true to appear through any of the
-- normal select policies. Private rooms (is_public = false) are deliberately
-- left with no non-admin select policy here -- they stay admin-manageable,
-- but a dedicated member/invitee access policy is deferred to a later phase
-- rather than guessed at now.
create policy common_space_rooms_select_public on common_space_rooms for select to anon, authenticated
  using (status = 'published' and visibility = 'free' and is_public = true);
create policy common_space_rooms_select_inner_circle on common_space_rooms for select to authenticated
  using (status = 'published' and visibility = 'inner_circle' and is_public = true and has_inner_circle_access(auth.uid()));
create policy common_space_rooms_select_gated on common_space_rooms for select to authenticated
  using (status = 'published' and visibility in ('premium', 'invite_only') and is_public = true);
create policy common_space_rooms_admin_all on common_space_rooms for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

create policy learn_series_select_public on learn_series for select to anon, authenticated
  using (status = 'published' and visibility = 'free');
create policy learn_series_select_inner_circle on learn_series for select to authenticated
  using (status = 'published' and visibility = 'inner_circle' and has_inner_circle_access(auth.uid()));
create policy learn_series_select_gated on learn_series for select to authenticated
  using (status = 'published' and visibility in ('premium', 'invite_only'));
create policy learn_series_admin_all on learn_series for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

create policy learn_episodes_select_public on learn_episodes for select to anon, authenticated
  using (status = 'published' and visibility = 'free');
create policy learn_episodes_select_inner_circle on learn_episodes for select to authenticated
  using (status = 'published' and visibility = 'inner_circle' and has_inner_circle_access(auth.uid()));
create policy learn_episodes_select_gated on learn_episodes for select to authenticated
  using (status = 'published' and visibility in ('premium', 'invite_only'));
create policy learn_episodes_admin_all on learn_episodes for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

create policy audio_talks_select_public on audio_talks for select to anon, authenticated
  using (status = 'published' and visibility = 'free');
create policy audio_talks_select_inner_circle on audio_talks for select to authenticated
  using (status = 'published' and visibility = 'inner_circle' and has_inner_circle_access(auth.uid()));
create policy audio_talks_select_gated on audio_talks for select to authenticated
  using (status = 'published' and visibility in ('premium', 'invite_only'));
create policy audio_talks_admin_all on audio_talks for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

create policy audio_series_select_public on audio_series for select to anon, authenticated
  using (status = 'published' and visibility = 'free');
create policy audio_series_select_inner_circle on audio_series for select to authenticated
  using (status = 'published' and visibility = 'inner_circle' and has_inner_circle_access(auth.uid()));
create policy audio_series_select_gated on audio_series for select to authenticated
  using (status = 'published' and visibility in ('premium', 'invite_only'));
create policy audio_series_admin_all on audio_series for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

create policy audio_episodes_select_public on audio_episodes for select to anon, authenticated
  using (status = 'published' and visibility = 'free');
create policy audio_episodes_select_inner_circle on audio_episodes for select to authenticated
  using (status = 'published' and visibility = 'inner_circle' and has_inner_circle_access(auth.uid()));
create policy audio_episodes_select_gated on audio_episodes for select to authenticated
  using (status = 'published' and visibility in ('premium', 'invite_only'));
create policy audio_episodes_admin_all on audio_episodes for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- feeling_checkins: owner-managed only
create policy feeling_checkins_all on feeling_checkins for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- session_logs: owner can read/insert their own history; immutable after that
create policy session_logs_select on session_logs for select to authenticated
  using (auth.uid() = user_id or is_admin(auth.uid()));
create policy session_logs_insert on session_logs for insert to authenticated
  with check (auth.uid() = user_id);
create policy session_logs_admin_write on session_logs for update to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy session_logs_admin_delete on session_logs for delete to authenticated
  using (is_admin(auth.uid()));

-- user_progress: read-only for the owner; written by backend/admin, not the
-- user's own client, so a user can't directly inflate their own stats
create policy user_progress_select on user_progress for select to authenticated
  using (auth.uid() = user_id or is_admin(auth.uid()));
create policy user_progress_admin_write on user_progress for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- favorites: owner-managed only
create policy favorites_all on favorites for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- common_space_presence: anyone signed in can see who's present (real
-- counts only -- there is no separate "online count" column to fake);
-- a user can only write their own presence row.
create policy common_space_presence_select on common_space_presence for select to authenticated
  using (true);
create policy common_space_presence_own on common_space_presence for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy common_space_presence_admin_all on common_space_presence for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- inner_circle_memberships: owner can see their own status; only admins grant/revoke
create policy inner_circle_memberships_select on inner_circle_memberships for select to authenticated
  using (auth.uid() = user_id or is_admin(auth.uid()));
create policy inner_circle_memberships_admin_write on inner_circle_memberships for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- invite_codes: admins manage; a user can see a code only after they've redeemed it
create policy invite_codes_select_redeemed on invite_codes for select to authenticated
  using (redeemed_by = auth.uid());
create policy invite_codes_admin_all on invite_codes for all to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- feedback_messages: a user can submit and read their own; admins moderate
create policy feedback_messages_select on feedback_messages for select to authenticated
  using (auth.uid() = user_id or is_admin(auth.uid()));
create policy feedback_messages_insert on feedback_messages for insert to authenticated
  with check (auth.uid() = user_id);
create policy feedback_messages_admin_write on feedback_messages for update to authenticated
  using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy feedback_messages_admin_delete on feedback_messages for delete to authenticated
  using (is_admin(auth.uid()));

-- admin_audit_log: admin-only, append-only (no update/delete policy at all)
create policy admin_audit_log_select on admin_audit_log for select to authenticated
  using (is_admin(auth.uid()));
create policy admin_audit_log_insert on admin_audit_log for insert to authenticated
  with check (is_admin(auth.uid()));
