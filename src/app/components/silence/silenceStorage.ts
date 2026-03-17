/* ──────────────────────────────────────────
   Persistent silence-time storage
   ────────────────────────────────────────── */

const TOTAL_KEY = "within_silence_total";
const SESSION_START_KEY = "within_silence_session_start";

/** Get the stored cumulative total (in seconds). */
export function getSilenceTotal(): number {
  const raw = localStorage.getItem(TOTAL_KEY);
  return raw ? Math.max(0, Math.floor(Number(raw))) : 0;
}

/** Overwrite the stored cumulative total. */
export function setSilenceTotal(seconds: number): void {
  localStorage.setItem(TOTAL_KEY, String(Math.floor(seconds)));
}

/** Mark the start of a new session (Unix ms timestamp). */
export function markSessionStart(): void {
  localStorage.setItem(SESSION_START_KEY, String(Date.now()));
}

/** Get the session start timestamp, or null if none is active. */
export function getSessionStart(): number | null {
  const raw = localStorage.getItem(SESSION_START_KEY);
  return raw ? Number(raw) : null;
}

/** Clear the session start marker. */
export function clearSessionStart(): void {
  localStorage.removeItem(SESSION_START_KEY);
}

/**
 * Recover from an interrupted session (e.g. app crash / tab close).
 * If a session was in progress, adds the elapsed time to the total,
 * clears the marker, and returns the seconds that were recovered.
 */
export function recoverInterruptedSession(): number {
  const start = getSessionStart();
  if (!start) return 0;
  const elapsed = Math.max(0, Math.floor((Date.now() - start) / 1000));
  if (elapsed > 0) {
    setSilenceTotal(getSilenceTotal() + elapsed);
  }
  clearSessionStart();
  return elapsed;
}

/** Human-readable cumulative time string. */
export function formatSilenceTime(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0 seconds";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  }
  // Only show seconds when total < 1 hour, to keep display clean
  if (hours === 0 && seconds > 0) {
    parts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);
  }

  return parts.join(" ");
}
