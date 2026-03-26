/**
 * audioConfig.ts
 *
 * Central registry for all guided session audio assets.
 * Each session key maps durations (in minutes) to their voice and background tracks.
 *
 * Paths are resolved at runtime via `new URL(path, import.meta.url).href` so
 * that Vite correctly handles asset filenames that contain spaces or parentheses.
 */

// ─── Helper ───────────────────────────────────────────────────────────────────

function asset(path: string): string {
  return new URL(path, import.meta.url).href;
}

// ─── Voice tracks: Core Guided Practices (Basic) ─────────────────────────────

const BASIC = "../assets/Audio files for sessions (Guided)/Guided Practices Basic";

const witnessVoice5   = asset(`${BASIC}/witness-5.m4a`);
const witnessVoice10  = asset(`${BASIC}/witness-10.m4a`);
const witnessVoice22  = asset(`${BASIC}/witness-22.m4a`);

const breathingVoice5  = asset(`${BASIC}/breathing-5.m4a`);
const breathingVoice10 = asset(`${BASIC}/breathing-10.m4a`);
const breathingVoice22 = asset(`${BASIC}/breathing-22.m4a`);

const boredomVoice5  = asset(`${BASIC}/boredom-5.m4a`);
const boredomVoice10 = asset(`${BASIC}/boredom-10.m4a`);
const boredomVoice22 = asset(`${BASIC}/boredom-22.m4a`);

// ─── Voice tracks: Advanced Breathing Series ─────────────────────────────────

const ADV = "../assets/Audio files for sessions (Guided)/Breathing Series (Advanced Guided Practice)";

const breathingAdvanced1    = asset(`${ADV}/Episode 1 (Navel).m4a`);
const breathingAdvanced1_10 = asset(`${ADV}/Episode 1 (Navel) (10 mins).m4a`);
const breathingAdvanced2_10 = asset(`${ADV}/Episode 2 (Carbon Clear) (10 mins).m4a`);
const breathingAdvanced3_10 = asset(`${ADV}/Episode 3 (Cold Fiire) (10 mins).m4a`);
const breathingAdvanced4_10 = asset(`${ADV}/Episode 4 (Golden Thread) (10 mins).m4a`);
const breathingAdvanced5_7  = asset(`${ADV}/Episode 5 (Balanced Breath) (7 mins).m4a`);

// ─── Voice tracks: More Guidance Episodes ────────────────────────────────────

const MORE = "../assets/Audio files for sessions (Guided)/Guided Practices (More Guidance)";

const episodeAbundance1    = asset(`${MORE}/Episode - Abundance Part 1.mp3`);
const episodeAbundance2    = asset(`${MORE}/Episode - Abundance Part 2.mp3`);
const episodeBodyScan      = asset(`${MORE}/Episode - Body Scan and Gratitude.mp3`);
const episodeMorning       = asset(`${MORE}/Episode - Morning Meditation.mp3`);
const episodeRisingCurrent = asset(`${MORE}/Episode - The Rising Current.mp3`);
const episodeTransform     = asset(`${MORE}/Episode - Trasform.mp3`);

// ─── Background tracks ────────────────────────────────────────────────────────

const BG = "../assets/Background Tracks";

const bgStillpoint      = asset(`${BG}/ES_Stillpoint - Center of Attention.wav`);
const bgBinaural        = asset(`${BG}/ES_Binaural Schumann Alpha - Mermaids' Dance - 369.wav`);
const bgEnlightenedDrift = asset(`${BG}/ES_Enlightened Drift - Amber Glow.wav`);
const bgNordicSunrise   = asset(`${BG}/ES_Nordic Sunrise (Alpha Drone 8Hz) - Bruce Brus.wav`);
const bgThetaDrone      = asset(`${BG}/ES_A New Beginning (Theta Drone L216Hz R220Hz) - Bruce Brus.wav`);
const bgDeepBlue        = asset(`${BG}/ES_Deep Blue Delta Sinus - Ookean.wav`);
const bgDeity           = asset(`${BG}/ES_Deity - Joseph Beg.wav`);
const bgBloom           = asset(`${BG}/ES_Bloom Without Orchard - Rand Aldo.wav`);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SessionAudio {
  /** Guided voice track for this duration */
  voice: string;
  /** Ambient background track to play underneath */
  background: string;
}

export interface SessionConfig {
  [durationMinutes: string]: SessionAudio;
}

export interface AudioConfig {
  [sessionKey: string]: SessionConfig;
}

// ─── Core Guided Sessions ─────────────────────────────────────────────────────

export const guidedSessions: AudioConfig = {
  witness: {
    "5":  { voice: witnessVoice5,  background: bgStillpoint },
    "10": { voice: witnessVoice10, background: bgStillpoint },
    "22": { voice: witnessVoice22, background: bgNordicSunrise },
  },

  breathing: {
    "5":  { voice: breathingVoice5,  background: bgBinaural },
    "10": { voice: breathingVoice10, background: bgBinaural },
    "22": { voice: breathingVoice22, background: bgThetaDrone },
  },

  boredom: {
    "5":  { voice: boredomVoice5,  background: bgEnlightenedDrift },
    "10": { voice: boredomVoice10, background: bgEnlightenedDrift },
    "22": { voice: boredomVoice22, background: bgDeepBlue },
  },
};

// ─── Dev audit: verify core session durations ────────────────────────────────
if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
  const EXPECTED: Record<string, string[]> = {
    witness:   ["5", "10", "22"],
    breathing: ["5", "10", "22"],
    boredom:   ["5", "10", "22"],
  };

  console.group("[audioConfig] guidedSessions audit");
  for (const [key, durations] of Object.entries(EXPECTED)) {
    const session = guidedSessions[key];
    if (!session) {
      console.error(`  ✗ "${key}" — session missing entirely`);
      continue;
    }
    for (const dur of durations) {
      const entry = session[dur];
      if (!entry) {
        console.error(`  ✗ "${key}" @ ${dur} min — entry missing`);
      } else if (!entry.voice || !entry.background) {
        console.warn(`  ⚠ "${key}" @ ${dur} min — voice=${!!entry.voice} bg=${!!entry.background}`);
      } else {
        console.log(`  ✓ "${key}" @ ${dur} min`, { voice: entry.voice, background: entry.background });
      }
    }
  }
  console.groupEnd();
}

// ─── Advanced Breathing Series ────────────────────────────────────────────────

export const breathingSeriesAdvanced: AudioConfig = {
  navel: {
    "full": { voice: breathingAdvanced1,    background: bgBinaural },
    "10":   { voice: breathingAdvanced1_10, background: bgBinaural },
  },
  carbonClear: {
    "10": { voice: breathingAdvanced2_10, background: bgThetaDrone },
  },
  coldFire: {
    "10": { voice: breathingAdvanced3_10, background: bgDeity },
  },
  goldenThread: {
    "10": { voice: breathingAdvanced4_10, background: bgNordicSunrise },
  },
  balancedBreath: {
    "7": { voice: breathingAdvanced5_7, background: bgStillpoint },
  },
};

// ─── More Guidance Episodes ───────────────────────────────────────────────────

export const guidedEpisodes: AudioConfig = {
  abundance: {
    "part1": { voice: episodeAbundance1,    background: bgBloom },
    "part2": { voice: episodeAbundance2,    background: bgBloom },
  },
  bodyScan: {
    "full": { voice: episodeBodyScan,       background: bgStillpoint },
  },
  morning: {
    "full": { voice: episodeMorning,        background: bgNordicSunrise },
  },
  risingCurrent: {
    "full": { voice: episodeRisingCurrent,  background: bgThetaDrone },
  },
  transform: {
    "full": { voice: episodeTransform,      background: bgDeepBlue },
  },
};

// ─── Utility ──────────────────────────────────────────────────────────────────

/**
 * Look up audio for a core guided session by key and duration.
 * Falls back to the nearest available duration if exact match not found.
 */
export function getSessionAudio(
  sessionKey: keyof typeof guidedSessions,
  durationMinutes: number,
): SessionAudio | null {
  const session = guidedSessions[sessionKey];
  if (!session) return null;

  const exact = session[String(durationMinutes)];
  if (exact) return exact;

  // Fallback: pick closest available duration
  const available = Object.keys(session).map(Number).sort((a, b) => a - b);
  const closest = available.reduce((prev, curr) =>
    Math.abs(curr - durationMinutes) < Math.abs(prev - durationMinutes) ? curr : prev,
  );
  return session[String(closest)] ?? null;
}
