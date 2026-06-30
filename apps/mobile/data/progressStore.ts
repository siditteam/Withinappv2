import AsyncStorage from "@react-native-async-storage/async-storage";

// Local-only persistence for now. Phase 3 swaps this for `session_logs` /
// `user_progress` / `feeling_checkins` writes through @within/db, behind
// this same set of function signatures.

export interface LocalSessionLog {
  id: string;
  practiceSessionId: string;
  durationSeconds: number;
  completedAt: string;
}

export interface LocalProgress {
  currentStreakDays: number;
  totalMeditationSeconds: number;
  // No Silence session flow writes to this yet -- it stays an honest zero
  // rather than being left out, since it mirrors user_progress.total_silence_seconds.
  totalSilenceSeconds: number;
  completedSessionsCount: number;
  lastPracticedAt: string | null;
}

export interface LocalFeelingCheckin {
  id: string;
  feeling: string;
  createdAt: string;
}

export interface LocalActivity {
  practiceSessionId: string;
  startedAt: string;
}

const KEYS = {
  sessionLogs: "within:sessionLogs",
  progress: "within:progress",
  feelingCheckins: "within:feelingCheckins",
  lastActivity: "within:lastActivity",
} as const;

const emptyProgress: LocalProgress = {
  currentStreakDays: 0,
  totalMeditationSeconds: 0,
  totalSilenceSeconds: 0,
  completedSessionsCount: 0,
  lastPracticedAt: null,
};

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isCalendarDayBefore(earlier: Date, later: Date): boolean {
  const oneDayMs = 86_400_000;
  const earlierStart = new Date(earlier.getFullYear(), earlier.getMonth(), earlier.getDate()).getTime();
  const laterStart = new Date(later.getFullYear(), later.getMonth(), later.getDate()).getTime();
  return laterStart - earlierStart === oneDayMs;
}

export async function getProgress(): Promise<LocalProgress> {
  return readJson(KEYS.progress, emptyProgress);
}

export async function getSessionLogs(): Promise<LocalSessionLog[]> {
  return readJson(KEYS.sessionLogs, []);
}

export async function getFeelingCheckins(): Promise<LocalFeelingCheckin[]> {
  return readJson(KEYS.feelingCheckins, []);
}

export async function getLastActivity(): Promise<LocalActivity | null> {
  return readJson<LocalActivity | null>(KEYS.lastActivity, null);
}

export async function recordPracticeStarted(practiceSessionId: string): Promise<void> {
  const activity: LocalActivity = { practiceSessionId, startedAt: new Date().toISOString() };
  await writeJson(KEYS.lastActivity, activity);
}

export async function recordSessionCompletion(entry: {
  practiceSessionId: string;
  durationSeconds: number;
}): Promise<LocalProgress> {
  const completedAt = new Date();
  const log: LocalSessionLog = {
    id: `${entry.practiceSessionId}-${completedAt.getTime()}`,
    practiceSessionId: entry.practiceSessionId,
    durationSeconds: entry.durationSeconds,
    completedAt: completedAt.toISOString(),
  };

  const logs = await getSessionLogs();
  await writeJson(KEYS.sessionLogs, [...logs, log]);

  const previous = await getProgress();
  const lastPracticedAt = previous.lastPracticedAt ? new Date(previous.lastPracticedAt) : null;

  let nextStreak = 1;
  if (lastPracticedAt) {
    if (isSameCalendarDay(lastPracticedAt, completedAt)) {
      nextStreak = previous.currentStreakDays;
    } else if (isCalendarDayBefore(lastPracticedAt, completedAt)) {
      nextStreak = previous.currentStreakDays + 1;
    }
  }

  const next: LocalProgress = {
    currentStreakDays: nextStreak,
    totalMeditationSeconds: previous.totalMeditationSeconds + entry.durationSeconds,
    totalSilenceSeconds: previous.totalSilenceSeconds,
    completedSessionsCount: previous.completedSessionsCount + 1,
    lastPracticedAt: completedAt.toISOString(),
  };
  await writeJson(KEYS.progress, next);
  await recordPracticeStarted(entry.practiceSessionId);

  return next;
}

export async function recordFeelingCheckin(feeling: string): Promise<void> {
  const checkin: LocalFeelingCheckin = {
    id: `${feeling}-${Date.now()}`,
    feeling,
    createdAt: new Date().toISOString(),
  };
  const existing = await getFeelingCheckins();
  await writeJson(KEYS.feelingCheckins, [...existing, checkin]);
}

export async function clearAllLocalData(): Promise<void> {
  await AsyncStorage.removeMany([KEYS.sessionLogs, KEYS.progress, KEYS.feelingCheckins, KEYS.lastActivity]);
}
