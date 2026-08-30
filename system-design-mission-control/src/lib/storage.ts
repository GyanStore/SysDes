/**
 * Local persistence for progress + the spaced-repetition deck.
 *
 * SECURITY: only non-sensitive learning progress is stored here (module ids,
 * scores, review dates). No auth tokens, no PII — per the client-security skill,
 * session tokens must never live in localStorage. All access is wrapped so a
 * disabled/full storage (e.g. private mode) degrades gracefully instead of
 * throwing.
 */

const KEY = "mc.progress.v1";

export interface ModuleProgress {
  /** beats completed: hook/animate/sandbox/tradeoff/recall */
  beats: string[];
  /** best recall quiz score 0..1 */
  quiz: number;
  completedAt?: number;
}

export interface DeckCard {
  moduleId: string;
  /** SM-2-lite fields */
  ease: number; // ~1.3 .. 2.8
  intervalDays: number;
  due: number; // epoch ms
  reps: number;
}

export interface ProgressState {
  modules: Record<string, ModuleProgress>;
  deck: Record<string, DeckCard>;
  xp: number;
  streak: { count: number; lastDay: string };
}

const empty: ProgressState = {
  modules: {},
  deck: {},
  xp: 0,
  streak: { count: 0, lastDay: "" },
};

function safeParse(raw: string | null): ProgressState {
  if (!raw) return structuredClone(empty);
  try {
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...structuredClone(empty), ...parsed };
  } catch {
    return structuredClone(empty);
  }
}

export function loadProgress(): ProgressState {
  try {
    return safeParse(localStorage.getItem(KEY));
  } catch {
    return structuredClone(empty);
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — progress simply won't persist this session */
  }
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}
