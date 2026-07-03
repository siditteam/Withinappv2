export * from "./contentRepository";
export * from "./progressStore";
export * from "./favoritesStore";

import { clearFavoritesData } from "./favoritesStore";
import { clearProgressData } from "./progressStore";

// The single "reset this device" entry point -- every local store must be
// cleared here so Settings > Reset never leaves stale data behind.
export async function clearAllLocalData(): Promise<void> {
  await clearProgressData();
  await clearFavoritesData();
}
