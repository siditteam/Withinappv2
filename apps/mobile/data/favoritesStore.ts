import { readJson, removeKeys, writeJson } from "./storage";

// Local-only persistence for now, mirroring the `favorites` table shape and a
// local view of inquiry progress. A later phase swaps this for @within/db
// writes behind these same signatures.

export type FavoriteContentType =
  | "practice_session"
  | "silence_preset"
  | "inquiry_card"
  | "library_item"
  | "audio_talk"
  | "learn_episode";

export interface LocalFavorite {
  contentType: FavoriteContentType;
  contentId: string;
  savedAt: string;
}

const KEYS = {
  favorites: "within:favorites",
  exploredInquiryCards: "within:exploredInquiryCards",
} as const;

export async function getFavorites(): Promise<LocalFavorite[]> {
  return readJson(KEYS.favorites, []);
}

export async function isFavorite(contentType: FavoriteContentType, contentId: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.some((favorite) => favorite.contentType === contentType && favorite.contentId === contentId);
}

// Returns the new saved state: true if the item was just saved, false if it
// was just removed.
export async function toggleFavorite(contentType: FavoriteContentType, contentId: string): Promise<boolean> {
  const favorites = await getFavorites();
  const remaining = favorites.filter(
    (favorite) => !(favorite.contentType === contentType && favorite.contentId === contentId),
  );
  const adding = remaining.length === favorites.length;
  const next = adding
    ? [...favorites, { contentType, contentId, savedAt: new Date().toISOString() }]
    : remaining;
  await writeJson(KEYS.favorites, next);
  return adding;
}

export async function getExploredInquiryCardIds(): Promise<string[]> {
  return readJson(KEYS.exploredInquiryCards, []);
}

export async function recordInquiryCardExplored(cardId: string): Promise<void> {
  const explored = await getExploredInquiryCardIds();
  if (explored.includes(cardId)) return;
  await writeJson(KEYS.exploredInquiryCards, [...explored, cardId]);
}

export async function clearFavoritesData(): Promise<void> {
  await removeKeys([KEYS.favorites, KEYS.exploredInquiryCards]);
}
