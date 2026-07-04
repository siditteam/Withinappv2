import {
  MOCK_BELL_ASSET_ID,
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
  type MediaAssetRow,
  type PracticeSessionRow,
  type QuoteRow,
  type SilencePresetRow,
  type WithinDbClient,
} from "@within/db";

import { supabaseClient } from "./supabaseClient";

// A plain URI string or a Metro `require()` asset id -- the subset of
// expo-audio's AudioSource that this app's content can produce.
export type PlayableAudioSource = string | number;

// Implemented by both MockContentRepository and SupabaseContentRepository
// below -- this is the seam that let Supabase replace the mock source
// without touching any screen.
export interface ContentRepository {
  listPracticeSessions(): Promise<PracticeSessionRow[]>;
  getPracticeSession(id: string): Promise<PracticeSessionRow | null>;
  getAudioSourceForMediaAsset(mediaAssetId: string): Promise<PlayableAudioSource | null>;
  listSilencePresets(): Promise<SilencePresetRow[]>;
  getSilencePreset(id: string): Promise<SilencePresetRow | null>;
  listInquiryCategories(): Promise<InquiryCategoryRow[]>;
  listInquiryCards(categoryId?: string): Promise<InquiryCardRow[]>;
  listLibraryItems(): Promise<LibraryItemRow[]>;
  getQuoteOfTheDay(): Promise<QuoteRow | null>;
  listCommonSpaceRooms(): Promise<CommonSpaceRoomRow[]>;
  getCommonSpaceRoom(id: string): Promise<CommonSpaceRoomRow | null>;
  listLearnSeries(): Promise<LearnSeriesRow[]>;
  getLearnSeries(id: string): Promise<LearnSeriesRow | null>;
  listLearnEpisodes(seriesId: string): Promise<LearnEpisodeRow[]>;
  getLearnEpisode(id: string): Promise<LearnEpisodeRow | null>;
  listAudioTalks(): Promise<AudioTalkRow[]>;
  getAudioTalk(id: string): Promise<AudioTalkRow | null>;
}

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

function pickQuoteOfTheDay(quotes: QuoteRow[]): QuoteRow | null {
  if (quotes.length === 0) return null;
  const index = dayOfYear(new Date()) % quotes.length;
  return quotes[index] ?? null;
}

class MockContentRepository implements ContentRepository {
  async listPracticeSessions(): Promise<PracticeSessionRow[]> {
    return [...mockPracticeSessions].sort((a, b) => a.sort_order - b.sort_order);
  }

  async getPracticeSession(id: string): Promise<PracticeSessionRow | null> {
    return mockPracticeSessions.find((session) => session.id === id) ?? null;
  }

  async getAudioSourceForMediaAsset(mediaAssetId: string): Promise<PlayableAudioSource | null> {
    if (mediaAssetId === MOCK_BELL_ASSET_ID) {
      return require("../assets/audio/sample-bell.wav");
    }
    return null;
  }

  async listSilencePresets(): Promise<SilencePresetRow[]> {
    return [...mockSilencePresets].sort((a, b) => a.sort_order - b.sort_order);
  }

  async getSilencePreset(id: string): Promise<SilencePresetRow | null> {
    return mockSilencePresets.find((preset) => preset.id === id) ?? null;
  }

  async listInquiryCategories(): Promise<InquiryCategoryRow[]> {
    return [...mockInquiryCategories].sort((a, b) => a.sort_order - b.sort_order);
  }

  async listInquiryCards(categoryId?: string): Promise<InquiryCardRow[]> {
    const cards = categoryId
      ? mockInquiryCards.filter((card) => card.category_id === categoryId)
      : mockInquiryCards;
    return [...cards].sort((a, b) => a.sort_order - b.sort_order);
  }

  async listLibraryItems(): Promise<LibraryItemRow[]> {
    return [...mockLibraryItems].sort((a, b) => a.sort_order - b.sort_order);
  }

  async getQuoteOfTheDay(): Promise<QuoteRow | null> {
    return pickQuoteOfTheDay(mockQuotes);
  }

  async listCommonSpaceRooms(): Promise<CommonSpaceRoomRow[]> {
    return [...mockCommonSpaceRooms].sort((a, b) => a.sort_order - b.sort_order);
  }

  async getCommonSpaceRoom(id: string): Promise<CommonSpaceRoomRow | null> {
    return mockCommonSpaceRooms.find((room) => room.id === id) ?? null;
  }

  async listLearnSeries(): Promise<LearnSeriesRow[]> {
    return [...mockLearnSeries].sort((a, b) => a.sort_order - b.sort_order);
  }

  async getLearnSeries(id: string): Promise<LearnSeriesRow | null> {
    return mockLearnSeries.find((series) => series.id === id) ?? null;
  }

  async listLearnEpisodes(seriesId: string): Promise<LearnEpisodeRow[]> {
    return mockLearnEpisodes
      .filter((episode) => episode.series_id === seriesId)
      .sort((a, b) => a.episode_number - b.episode_number);
  }

  async getLearnEpisode(id: string): Promise<LearnEpisodeRow | null> {
    return mockLearnEpisodes.find((episode) => episode.id === id) ?? null;
  }

  async listAudioTalks(): Promise<AudioTalkRow[]> {
    return [...mockAudioTalks].sort((a, b) => a.sort_order - b.sort_order);
  }

  async getAudioTalk(id: string): Promise<AudioTalkRow | null> {
    return mockAudioTalks.find((talk) => talk.id === id) ?? null;
  }
}

// Real queries against the Phase 1 schema. RLS does the actual access
// control (published + free, or published + inner_circle with an active
// membership); the `.eq("status", "published")` filters here are just
// explicit intent, not the real gate.
class SupabaseContentRepository implements ContentRepository {
  constructor(private readonly client: WithinDbClient) {}

  async listPracticeSessions(): Promise<PracticeSessionRow[]> {
    const { data, error } = await this.client
      .from("practice_sessions")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async getPracticeSession(id: string): Promise<PracticeSessionRow | null> {
    const { data, error } = await this.client.from("practice_sessions").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    // postgrest-js's select-string type inference needs Relationships on
    // every table to resolve cleanly with a hand-written (non-codegen)
    // Database type; the runtime shape is exactly PracticeSessionRow.
    return (data as PracticeSessionRow | null) ?? null;
  }

  async getAudioSourceForMediaAsset(mediaAssetId: string): Promise<PlayableAudioSource | null> {
    const { data, error } = await this.client.from("media_assets").select("*").eq("id", mediaAssetId).maybeSingle();
    if (error) throw error;
    const asset = data as MediaAssetRow | null;
    if (asset?.public_url) return asset.public_url;
    // No real recording uploaded yet for this asset -- fall back to the
    // bundled placeholder so the session screen still has something to play.
    return require("../assets/audio/sample-bell.wav");
  }

  async listSilencePresets(): Promise<SilencePresetRow[]> {
    const { data, error } = await this.client
      .from("silence_presets")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async getSilencePreset(id: string): Promise<SilencePresetRow | null> {
    const { data, error } = await this.client.from("silence_presets").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return (data as SilencePresetRow | null) ?? null;
  }

  async listInquiryCategories(): Promise<InquiryCategoryRow[]> {
    const { data, error } = await this.client
      .from("inquiry_categories")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async listInquiryCards(categoryId?: string): Promise<InquiryCardRow[]> {
    let query = this.client.from("inquiry_cards").select("*").eq("status", "published");
    if (categoryId) query = query.eq("category_id", categoryId);
    const { data, error } = await query.order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async listLibraryItems(): Promise<LibraryItemRow[]> {
    const { data, error } = await this.client
      .from("library_items")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async getQuoteOfTheDay(): Promise<QuoteRow | null> {
    const { data, error } = await this.client.from("quotes").select("*").eq("status", "published");
    if (error) throw error;
    return pickQuoteOfTheDay(data ?? []);
  }

  async listCommonSpaceRooms(): Promise<CommonSpaceRoomRow[]> {
    const { data, error } = await this.client
      .from("common_space_rooms")
      .select("*")
      .eq("status", "published")
      .eq("is_public", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async getCommonSpaceRoom(id: string): Promise<CommonSpaceRoomRow | null> {
    const { data, error } = await this.client.from("common_space_rooms").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return (data as CommonSpaceRoomRow | null) ?? null;
  }

  async listLearnSeries(): Promise<LearnSeriesRow[]> {
    const { data, error } = await this.client
      .from("learn_series")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async getLearnSeries(id: string): Promise<LearnSeriesRow | null> {
    const { data, error } = await this.client.from("learn_series").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return (data as LearnSeriesRow | null) ?? null;
  }

  async listLearnEpisodes(seriesId: string): Promise<LearnEpisodeRow[]> {
    const { data, error } = await this.client
      .from("learn_episodes")
      .select("*")
      .eq("series_id", seriesId)
      .eq("status", "published")
      .order("episode_number", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async getLearnEpisode(id: string): Promise<LearnEpisodeRow | null> {
    const { data, error } = await this.client.from("learn_episodes").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return (data as LearnEpisodeRow | null) ?? null;
  }

  async listAudioTalks(): Promise<AudioTalkRow[]> {
    const { data, error } = await this.client
      .from("audio_talks")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async getAudioTalk(id: string): Promise<AudioTalkRow | null> {
    const { data, error } = await this.client.from("audio_talks").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return (data as AudioTalkRow | null) ?? null;
  }
}

export const contentRepository: ContentRepository = supabaseClient
  ? new SupabaseContentRepository(supabaseClient)
  : new MockContentRepository();
