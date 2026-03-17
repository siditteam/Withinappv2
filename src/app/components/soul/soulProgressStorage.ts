const STORAGE_KEY = "within-soul-completed-count";

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
 * Progressive Easy-mode duration for Soul Practices.
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
