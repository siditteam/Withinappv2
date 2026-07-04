import {
  mockAudioTalks,
  mockCommonSpaceRooms,
  mockInquiryCards,
  mockInquiryCategories,
  mockLearnEpisodes,
  mockLearnSeries,
  mockLibraryItems,
  mockPracticeSessions,
  mockQuotes,
  mockSilencePresets,
  type AudioTalkRow,
  type CommonSpaceRoomRow,
  type InquiryCardRow,
  type InquiryCategoryRow,
  type LearnEpisodeRow,
  type LearnSeriesRow,
  type LibraryItemRow,
  type PracticeSessionRow,
  type QuoteRow,
  type SilencePresetRow,
  type WithinDbClient,
} from "@within/db";

import { createSupabaseServerClient, supabaseConfigured } from "@/lib/supabase/server";

// Server-side content access for the admin console. Against a live project
// the client is bound to the caller's auth cookies, so RLS decides what an
// admin sees (all statuses) versus anyone else (published only).
export interface AdminContentSource {
  listPracticeSessions(): Promise<PracticeSessionRow[]>;
  listSilencePresets(): Promise<SilencePresetRow[]>;
  listInquiryCategories(): Promise<InquiryCategoryRow[]>;
  listInquiryCards(): Promise<InquiryCardRow[]>;
  listLibraryItems(): Promise<LibraryItemRow[]>;
  listQuotes(): Promise<QuoteRow[]>;
  listCommonSpaceRooms(): Promise<CommonSpaceRoomRow[]>;
  listLearnSeries(): Promise<LearnSeriesRow[]>;
  listLearnEpisodes(): Promise<LearnEpisodeRow[]>;
  listAudioTalks(): Promise<AudioTalkRow[]>;
}

class MockContentSource implements AdminContentSource {
  async listPracticeSessions() {
    return [...mockPracticeSessions].sort((a, b) => a.sort_order - b.sort_order);
  }
  async listSilencePresets() {
    return [...mockSilencePresets].sort((a, b) => a.sort_order - b.sort_order);
  }
  async listInquiryCategories() {
    return [...mockInquiryCategories].sort((a, b) => a.sort_order - b.sort_order);
  }
  async listInquiryCards() {
    return [...mockInquiryCards].sort((a, b) => a.sort_order - b.sort_order);
  }
  async listLibraryItems() {
    return [...mockLibraryItems].sort((a, b) => a.sort_order - b.sort_order);
  }
  async listQuotes() {
    return [...mockQuotes];
  }
  async listCommonSpaceRooms() {
    return [...mockCommonSpaceRooms].sort((a, b) => a.sort_order - b.sort_order);
  }
  async listLearnSeries() {
    return [...mockLearnSeries].sort((a, b) => a.sort_order - b.sort_order);
  }
  async listLearnEpisodes() {
    return [...mockLearnEpisodes].sort((a, b) => a.episode_number - b.episode_number);
  }
  async listAudioTalks() {
    return [...mockAudioTalks].sort((a, b) => a.sort_order - b.sort_order);
  }
}

class SupabaseContentSource implements AdminContentSource {
  constructor(private readonly client: WithinDbClient) {}

  private async list<T>(query: PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  listPracticeSessions() {
    return this.list(this.client.from("practice_sessions").select("*").order("sort_order"));
  }
  listSilencePresets() {
    return this.list(this.client.from("silence_presets").select("*").order("sort_order"));
  }
  listInquiryCategories() {
    return this.list(this.client.from("inquiry_categories").select("*").order("sort_order"));
  }
  listInquiryCards() {
    return this.list(this.client.from("inquiry_cards").select("*").order("sort_order"));
  }
  listLibraryItems() {
    return this.list(this.client.from("library_items").select("*").order("sort_order"));
  }
  listQuotes() {
    return this.list(this.client.from("quotes").select("*"));
  }
  listCommonSpaceRooms() {
    return this.list(this.client.from("common_space_rooms").select("*").order("sort_order"));
  }
  listLearnSeries() {
    return this.list(this.client.from("learn_series").select("*").order("sort_order"));
  }
  listLearnEpisodes() {
    return this.list(this.client.from("learn_episodes").select("*").order("episode_number"));
  }
  listAudioTalks() {
    return this.list(this.client.from("audio_talks").select("*").order("sort_order"));
  }
}

const mockContentSource = new MockContentSource();

// Per-request: the Supabase client carries the caller's session cookies, so
// two requests must never share one.
export async function getContentSource(): Promise<AdminContentSource> {
  if (!supabaseConfigured) {
    return mockContentSource;
  }
  return new SupabaseContentSource(await createSupabaseServerClient());
}

// True when running against mock content -- pages surface this so nobody
// mistakes the preview data for a live project.
export const usingMockContent = !supabaseConfigured;
