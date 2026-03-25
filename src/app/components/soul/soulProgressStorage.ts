const STORAGE_KEY = "within-soul-completed-count";
const NEXT_PRACTICE_KEY = "within-soul-next-practice-id";
const TOTAL_PRACTICES = 10;

/** Returns the ID of the next practice the user should do (1-based). */
export function getNextPracticeId(): number {
  const saved = localStorage.getItem(NEXT_PRACTICE_KEY);
  return saved ? parseInt(saved, 10) : 1;
}

/** Records that a practice was completed and advances the pointer to the next one. */
export function markPracticeCompleted(id: number): void {
  const current = getNextPracticeId();
  if (id >= current) {
    const next = Math.min(id + 1, TOTAL_PRACTICES);
    localStorage.setItem(NEXT_PRACTICE_KEY, String(next));
  }
}

export function getSoulCompletedCount(): number {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? parseInt(saved, 10) : 0;
}

export function incrementSoulCompleted(): number {
  const next = getSoulCompletedCount() + 1;
  localStorage.setItem(STORAGE_KEY, String(next));
  return next;
}

/**
 * Progressive Easy-mode duration for Guided Practices.
 * Starts at 10 min, increases by 5 min per completed practice, caps at 30 min.
 */
export function getEasySoulDuration(): { seconds: number; label: string; atCap: boolean } {
  const count = getSoulCompletedCount();
  const minutes = Math.min(10 + count * 5, 30);
  const atCap = minutes >= 30;
  return {
    seconds: minutes * 60,
    label: `${minutes} min`,
    atCap,
  };
}
