import type { ContentStatus, ContentVisibility } from "@within/validation";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Insertable<Row, DefaultKeys extends keyof Row = never> = Omit<Row, DefaultKeys> &
  Partial<Pick<Row, DefaultKeys>>;
type Updatable<Row> = Partial<Omit<Row, "id" | "created_at" | "updated_at">>;

export interface ProfileRow {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_media_id: string | null;
  is_guest: boolean;
  created_at: string;
  updated_at: string;
}
export type ProfileInsert = Insertable<ProfileRow, "created_at" | "updated_at" | "is_guest">;
export type ProfileUpdate = Updatable<ProfileRow>;

export interface UserPreferenceRow {
  id: string;
  user_id: string;
  theme: "system" | "light" | "dark";
  reminder_enabled: boolean;
  reminder_time: string | null;
  created_at: string;
  updated_at: string;
}
export type UserPreferenceInsert = Insertable<
  UserPreferenceRow,
  "id" | "created_at" | "updated_at" | "theme" | "reminder_enabled"
>;
export type UserPreferenceUpdate = Updatable<UserPreferenceRow>;

export interface AdminRoleRow {
  id: string;
  user_id: string;
  role: "admin" | "editor";
  granted_by: string | null;
  created_at: string;
  updated_at: string;
}
export type AdminRoleInsert = Insertable<AdminRoleRow, "id" | "created_at" | "updated_at" | "role">;
export type AdminRoleUpdate = Updatable<AdminRoleRow>;

export interface MediaAssetRow {
  id: string;
  kind: "audio" | "image" | "video";
  storage_path: string;
  public_url: string | null;
  visibility: ContentVisibility;
  duration_seconds: number | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}
export type MediaAssetInsert = Insertable<MediaAssetRow, "id" | "created_at" | "updated_at" | "visibility">;
export type MediaAssetUpdate = Updatable<MediaAssetRow>;

interface ContentRowBase {
  id: string;
  status: ContentStatus;
  visibility: ContentVisibility;
  created_at: string;
  updated_at: string;
}

export interface PracticeSessionRow extends ContentRowBase {
  title: string;
  description: string | null;
  category: string | null;
  meaning: string;
  motive: string;
  completion_suggestion: string | null;
  audio_asset_id: string | null;
  cover_asset_id: string | null;
  duration_seconds: number;
  sort_order: number;
}
export type PracticeSessionInsert = Insertable<
  PracticeSessionRow,
  "id" | "created_at" | "updated_at" | "status" | "visibility" | "sort_order"
>;
export type PracticeSessionUpdate = Updatable<PracticeSessionRow>;

export interface SilencePresetRow extends ContentRowBase {
  title: string;
  description: string | null;
  duration_seconds: number;
  ambient_audio_asset_id: string | null;
  bell_interval_seconds: number | null;
  sort_order: number;
}
export type SilencePresetInsert = Insertable<
  SilencePresetRow,
  "id" | "created_at" | "updated_at" | "status" | "visibility" | "sort_order"
>;
export type SilencePresetUpdate = Updatable<SilencePresetRow>;

export interface InquiryCategoryRow extends ContentRowBase {
  title: string;
  description: string | null;
  sort_order: number;
}
export type InquiryCategoryInsert = Insertable<
  InquiryCategoryRow,
  "id" | "created_at" | "updated_at" | "status" | "visibility" | "sort_order"
>;
export type InquiryCategoryUpdate = Updatable<InquiryCategoryRow>;

export interface InquiryCardRow extends ContentRowBase {
  category_id: string;
  prompt: string;
  question: string | null;
  answer: string | null;
  explanation: string | null;
  reflection_prompt: string | null;
  mood_relevance: string[];
  sort_order: number;
}
export type InquiryCardInsert = Insertable<
  InquiryCardRow,
  "id" | "created_at" | "updated_at" | "status" | "visibility" | "sort_order" | "mood_relevance"
>;
export type InquiryCardUpdate = Updatable<InquiryCardRow>;

export interface LibraryItemRow extends ContentRowBase {
  title: string | null;
  body: string;
  author: string | null;
  meaning: string | null;
  deeper_explanation: string | null;
  related_inquiry_card_id: string | null;
  sort_order: number;
}
export type LibraryItemInsert = Insertable<
  LibraryItemRow,
  "id" | "created_at" | "updated_at" | "status" | "visibility" | "sort_order"
>;
export type LibraryItemUpdate = Updatable<LibraryItemRow>;

export interface QuoteRow extends ContentRowBase {
  body: string;
  author: string | null;
  display_date: string | null;
}
export type QuoteInsert = Insertable<QuoteRow, "id" | "created_at" | "updated_at" | "status" | "visibility">;
export type QuoteUpdate = Updatable<QuoteRow>;

export interface DailyScheduleRow extends ContentRowBase {
  title: string;
  description: string | null;
  scheduled_at: string;
  reference_type: "practice_session" | "silence_preset" | "audio_talk" | "learn_episode" | null;
  reference_id: string | null;
}
export type DailyScheduleInsert = Insertable<
  DailyScheduleRow,
  "id" | "created_at" | "updated_at" | "status" | "visibility"
>;
export type DailyScheduleUpdate = Updatable<DailyScheduleRow>;

export interface FeelingCheckinRow {
  id: string;
  user_id: string;
  feeling: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}
export type FeelingCheckinInsert = Insertable<FeelingCheckinRow, "id" | "created_at" | "updated_at">;
export type FeelingCheckinUpdate = Updatable<FeelingCheckinRow>;

export interface SessionLogRow {
  id: string;
  user_id: string;
  practice_session_id: string | null;
  silence_preset_id: string | null;
  kind: "practice" | "silence";
  duration_seconds: number;
  completed_at: string;
  created_at: string;
  updated_at: string;
}
export type SessionLogInsert = Insertable<SessionLogRow, "id" | "created_at" | "updated_at" | "completed_at">;
export type SessionLogUpdate = Updatable<SessionLogRow>;

export interface UserProgressRow {
  id: string;
  user_id: string;
  current_streak_days: number;
  total_meditation_seconds: number;
  total_silence_seconds: number;
  completed_sessions_count: number;
  last_practiced_at: string | null;
  created_at: string;
  updated_at: string;
}
export type UserProgressInsert = Insertable<
  UserProgressRow,
  | "id"
  | "created_at"
  | "updated_at"
  | "current_streak_days"
  | "total_meditation_seconds"
  | "total_silence_seconds"
  | "completed_sessions_count"
>;
export type UserProgressUpdate = Updatable<UserProgressRow>;

export interface FavoriteRow {
  id: string;
  user_id: string;
  content_type: "practice_session" | "silence_preset" | "inquiry_card" | "library_item" | "audio_talk" | "learn_episode";
  content_id: string;
  created_at: string;
  updated_at: string;
}
export type FavoriteInsert = Insertable<FavoriteRow, "id" | "created_at" | "updated_at">;
export type FavoriteUpdate = Updatable<FavoriteRow>;

export interface CommonSpaceRoomRow extends ContentRowBase {
  title: string;
  description: string | null;
  room_type: "silence" | "guided_practice" | "live_guided";
  is_public: boolean;
  duration_seconds: number | null;
  purpose: string | null;
  practice_session_id: string | null;
  sort_order: number;
}
export type CommonSpaceRoomInsert = Insertable<
  CommonSpaceRoomRow,
  "id" | "created_at" | "updated_at" | "status" | "visibility" | "sort_order" | "room_type" | "is_public"
>;
export type CommonSpaceRoomUpdate = Updatable<CommonSpaceRoomRow>;

export interface CommonSpacePresenceRow {
  id: string;
  room_id: string;
  user_id: string;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
}
export type CommonSpacePresenceInsert = Insertable<
  CommonSpacePresenceRow,
  "id" | "created_at" | "updated_at" | "last_seen_at"
>;
export type CommonSpacePresenceUpdate = Updatable<CommonSpacePresenceRow>;

export interface LearnSeriesRow extends ContentRowBase {
  title: string;
  description: string | null;
  cover_asset_id: string | null;
  sort_order: number;
}
export type LearnSeriesInsert = Insertable<
  LearnSeriesRow,
  "id" | "created_at" | "updated_at" | "status" | "visibility" | "sort_order"
>;
export type LearnSeriesUpdate = Updatable<LearnSeriesRow>;

export interface LearnEpisodeRow extends ContentRowBase {
  series_id: string;
  title: string;
  audio_asset_id: string | null;
  duration_seconds: number | null;
  episode_number: number;
}
export type LearnEpisodeInsert = Insertable<
  LearnEpisodeRow,
  "id" | "created_at" | "updated_at" | "status" | "visibility" | "episode_number"
>;
export type LearnEpisodeUpdate = Updatable<LearnEpisodeRow>;

export interface AudioTalkRow extends ContentRowBase {
  title: string;
  description: string | null;
  speaker: string | null;
  audio_asset_id: string | null;
  duration_seconds: number | null;
  sort_order: number;
}
export type AudioTalkInsert = Insertable<
  AudioTalkRow,
  "id" | "created_at" | "updated_at" | "status" | "visibility" | "sort_order"
>;
export type AudioTalkUpdate = Updatable<AudioTalkRow>;

export interface AudioSeriesRow extends ContentRowBase {
  title: string;
  description: string | null;
  cover_asset_id: string | null;
  sort_order: number;
}
export type AudioSeriesInsert = Insertable<
  AudioSeriesRow,
  "id" | "created_at" | "updated_at" | "status" | "visibility" | "sort_order"
>;
export type AudioSeriesUpdate = Updatable<AudioSeriesRow>;

export interface AudioEpisodeRow extends ContentRowBase {
  series_id: string;
  title: string;
  audio_asset_id: string | null;
  duration_seconds: number | null;
  episode_number: number;
}
export type AudioEpisodeInsert = Insertable<
  AudioEpisodeRow,
  "id" | "created_at" | "updated_at" | "status" | "visibility" | "episode_number"
>;
export type AudioEpisodeUpdate = Updatable<AudioEpisodeRow>;

export interface InnerCircleMembershipRow {
  id: string;
  user_id: string;
  status: "active" | "revoked";
  granted_by: string | null;
  granted_at: string;
  created_at: string;
  updated_at: string;
}
export type InnerCircleMembershipInsert = Insertable<
  InnerCircleMembershipRow,
  "id" | "created_at" | "updated_at" | "status" | "granted_at"
>;
export type InnerCircleMembershipUpdate = Updatable<InnerCircleMembershipRow>;

export interface InviteCodeRow {
  id: string;
  code: string;
  created_by: string | null;
  redeemed_by: string | null;
  redeemed_at: string | null;
  expires_at: string | null;
  max_uses: number;
  use_count: number;
  created_at: string;
  updated_at: string;
}
export type InviteCodeInsert = Insertable<
  InviteCodeRow,
  "id" | "created_at" | "updated_at" | "max_uses" | "use_count"
>;
export type InviteCodeUpdate = Updatable<InviteCodeRow>;

export interface FeedbackMessageRow {
  id: string;
  user_id: string;
  message: string;
  status: "open" | "reviewed" | "resolved";
  created_at: string;
  updated_at: string;
}
export type FeedbackMessageInsert = Insertable<FeedbackMessageRow, "id" | "created_at" | "updated_at" | "status">;
export type FeedbackMessageUpdate = Updatable<FeedbackMessageRow>;

export interface AdminAuditLogRow {
  id: string;
  actor_id: string | null;
  action: string;
  target_table: string | null;
  target_id: string | null;
  metadata: Json | null;
  created_at: string;
  updated_at: string;
}
export type AdminAuditLogInsert = Insertable<AdminAuditLogRow, "id" | "created_at" | "updated_at">;
export type AdminAuditLogUpdate = Updatable<AdminAuditLogRow>;

interface TableDefinition<Row, Insert, Update> {
  Row: Row;
  Insert: Insert;
  Update: Update;
  // No embedded-resource (foreign table) selects are used anywhere in this
  // app -- every query is explicit -- so this is intentionally always
  // empty rather than describing real foreign keys. supabase-js's generic
  // select-string parser requires the field to exist at all, though.
  Relationships: [];
}

export interface Database {
  public: {
    Tables: {
      profiles: TableDefinition<ProfileRow, ProfileInsert, ProfileUpdate>;
      user_preferences: TableDefinition<UserPreferenceRow, UserPreferenceInsert, UserPreferenceUpdate>;
      admin_roles: TableDefinition<AdminRoleRow, AdminRoleInsert, AdminRoleUpdate>;
      media_assets: TableDefinition<MediaAssetRow, MediaAssetInsert, MediaAssetUpdate>;
      practice_sessions: TableDefinition<PracticeSessionRow, PracticeSessionInsert, PracticeSessionUpdate>;
      silence_presets: TableDefinition<SilencePresetRow, SilencePresetInsert, SilencePresetUpdate>;
      inquiry_categories: TableDefinition<InquiryCategoryRow, InquiryCategoryInsert, InquiryCategoryUpdate>;
      inquiry_cards: TableDefinition<InquiryCardRow, InquiryCardInsert, InquiryCardUpdate>;
      library_items: TableDefinition<LibraryItemRow, LibraryItemInsert, LibraryItemUpdate>;
      quotes: TableDefinition<QuoteRow, QuoteInsert, QuoteUpdate>;
      daily_schedule: TableDefinition<DailyScheduleRow, DailyScheduleInsert, DailyScheduleUpdate>;
      feeling_checkins: TableDefinition<FeelingCheckinRow, FeelingCheckinInsert, FeelingCheckinUpdate>;
      session_logs: TableDefinition<SessionLogRow, SessionLogInsert, SessionLogUpdate>;
      user_progress: TableDefinition<UserProgressRow, UserProgressInsert, UserProgressUpdate>;
      favorites: TableDefinition<FavoriteRow, FavoriteInsert, FavoriteUpdate>;
      common_space_rooms: TableDefinition<CommonSpaceRoomRow, CommonSpaceRoomInsert, CommonSpaceRoomUpdate>;
      common_space_presence: TableDefinition<
        CommonSpacePresenceRow,
        CommonSpacePresenceInsert,
        CommonSpacePresenceUpdate
      >;
      learn_series: TableDefinition<LearnSeriesRow, LearnSeriesInsert, LearnSeriesUpdate>;
      learn_episodes: TableDefinition<LearnEpisodeRow, LearnEpisodeInsert, LearnEpisodeUpdate>;
      audio_talks: TableDefinition<AudioTalkRow, AudioTalkInsert, AudioTalkUpdate>;
      audio_series: TableDefinition<AudioSeriesRow, AudioSeriesInsert, AudioSeriesUpdate>;
      audio_episodes: TableDefinition<AudioEpisodeRow, AudioEpisodeInsert, AudioEpisodeUpdate>;
      inner_circle_memberships: TableDefinition<
        InnerCircleMembershipRow,
        InnerCircleMembershipInsert,
        InnerCircleMembershipUpdate
      >;
      invite_codes: TableDefinition<InviteCodeRow, InviteCodeInsert, InviteCodeUpdate>;
      feedback_messages: TableDefinition<FeedbackMessageRow, FeedbackMessageInsert, FeedbackMessageUpdate>;
      admin_audit_log: TableDefinition<AdminAuditLogRow, AdminAuditLogInsert, AdminAuditLogUpdate>;
    };
  };
}
