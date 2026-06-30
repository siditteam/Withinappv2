import type {
  AudioTalkRow,
  CommonSpaceRoomRow,
  InquiryCardRow,
  InquiryCategoryRow,
  LearnSeriesRow,
  LibraryItemRow,
  MediaAssetRow,
  PracticeSessionRow,
  QuoteRow,
  SilencePresetRow,
  WithinDbClient,
} from "@within/db";

import {
  MOCK_BELL_ASSET_ID,
  mockAudioTalks,
  mockCommonSpaceRooms,
  mockInquiryCards,
  mockInquiryCategories,
  mockLearnSeries,
  mockLibraryItems,
  mockPracticeSessions,
  mockQuotes,
  mockSilencePresets,
} from "./mockData";
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
  listInquiryCategories(): Promise<InquiryCategoryRow[]>;
  listInquiryCards(categoryId?: string): Promise<InquiryCardRow[]>;
  listLibraryItems(): Promise<LibraryItemRow[]>;
  getQuoteOfTheDay(): Promise<QuoteRow | null>;
  listCommonSpaceRooms(): Promise<CommonSpaceRoomRow[]>;
  listLearnSeries(): Promise<LearnSeriesRow[]>;
  listAudioTalks(): Promise<AudioTalkRow[]>;
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

  async listLearnSeries(): Promise<LearnSeriesRow[]> {
    return [...mockLearnSeries].sort((a, b) => a.sort_order - b.sort_order);
  }

  async listAudioTalks(): Promise<AudioTalkRow[]> {
    return [...mockAudioTalks].sort((a, b) => a.sort_order - b.sort_order);
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

  async listLearnSeries(): Promise<LearnSeriesRow[]> {
    const { data, error } = await this.client
      .from("learn_series")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
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
}

export const contentRepository: ContentRepository = supabaseClient
  ? new SupabaseContentRepository(supabaseClient)
  : new MockContentRepository();
