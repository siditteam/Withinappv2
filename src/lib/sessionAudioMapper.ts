/**
 * sessionAudioMapper.ts
 *
 * Parses guided session audio filenames into normalised session keys
 * that match the keys in audioConfig.ts (`guidedSessions`).
 *
 * Filename format:  "Session X - PracticeName (N mins).m4a"
 * Desired output:   "practicename"
 *
 * Valid files must contain a numeric duration annotation: "(N mins)".
 * Files without it are ignored — this excludes variants such as
 *   "(Vocals)", "(With Music)", plain .wav files with no duration, etc.
 *
 * Examples
 *   "Session 1 - Breathing (5 mins).m4a"     → "breathing"  ✓
 *   "Session 2 - Witness (10 mins).m4a"      → "witness"    ✓
 *   "Session 3 - Boredom (22 mins).m4a"      → "boredom"    ✓
 *   "Session 1 - Breathing (Vocals).m4a"     → null         ✗
 *   "Session 1 - Breathing (With Music).m4a" → null         ✗
 *   "ES_Stillpoint - Center of Attention.wav" → null        ✗
 */

/**
 * Extracts the practice name from a guided-session filename and returns it
 * as a lowercase, trimmed string suitable for use as a `guidedSessions` key.
 *
 * Steps:
 *   1. Validate that the filename contains a numeric duration "(N mins)".
 *      Files without it (e.g. "(Vocals)", "(With Music)", bare .wav) return null.
 *   2. Strip the file extension.
 *   3. Remove the "Session X - " prefix (case-insensitive).
 *   4. Remove the trailing duration "(N mins)" annotation.
 *   5. Lowercase and trim whitespace.
 *
 * Returns `null` if the filename doesn't match the expected pattern.
 */
export function parseSessionName(filename: string): string | null {
  // Guard: must contain a numeric duration annotation e.g. "(5 mins)" / "(22 min)"
  if (!/\(\d+\s*mins?\)/i.test(filename)) return null;

  // Remove directory path and extension
  const basename = filename.replace(/^.*[\\/]/, "").replace(/\.[^.]+$/, "");

  // Remove "Session X - " prefix (e.g. "Session 2 - ")
  const withoutPrefix = basename.replace(/^session\s+\d+\s*-\s*/i, "");

  // Remove trailing duration annotation e.g. " (5 mins)", " (22 mins)"
  const withoutDuration = withoutPrefix.replace(/\s*\(\d+\s*mins?\)\s*$/i, "");

  const result = withoutDuration.toLowerCase().trim();

  return result.length > 0 ? result : null;
}

/**
 * Groups an array of filenames by their parsed session key.
 *
 * @example
 *   groupBySessionName(["Session 1 - Breathing (5 mins).m4a", "Session 1 - Breathing (10 mins).m4a"])
 *   // → { breathing: ["Session 1 - Breathing (5 mins).m4a", "Session 1 - Breathing (10 mins).m4a"] }
 */
export function groupBySessionName(
  filenames: string[],
): Record<string, string[]> {
  const groups: Record<string, string[]> = {};

  for (const filename of filenames) {
    const key = parseSessionName(filename);
    if (key === null) continue;

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(filename);
  }

  return groups;
}
