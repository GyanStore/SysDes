import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loadProgress,
  saveProgress,
  resetProgress as resetStore,
  todayKey,
  type ProgressState,
  type ModuleProgress,
} from "./storage";
import { newCard, schedule } from "./srs";

interface ProgressAPI {
  state: ProgressState;
  moduleProgress: (id: string) => ModuleProgress;
  completeBeat: (moduleId: string, beat: string, xp?: number) => void;
  recordQuiz: (moduleId: string, score: number) => void;
  addToDeck: (moduleId: string) => void;
  gradeCard: (moduleId: string, grade: 0 | 1 | 2 | 3) => void;
  reset: () => void;
}

const emptyModule: ModuleProgress = { beats: [], quiz: 0 };

const Ctx = createContext<ProgressAPI | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadProgress());

  useEffect(() => {
    saveProgress(state);
  }, [state]);

  const bumpStreak = useCallback((s: ProgressState): ProgressState => {
    const today = todayKey();
    if (s.streak.lastDay === today) return s;
    const yesterday = todayKey(new Date(Date.now() - 86400000));
    const count = s.streak.lastDay === yesterday ? s.streak.count + 1 : 1;
    return { ...s, streak: { count, lastDay: today } };
  }, []);

  const completeBeat = useCallback(
    (moduleId: string, beat: string, xp = 10) => {
      setState((s) => {
        const cur = s.modules[moduleId] ?? { ...emptyModule };
        if (cur.beats.includes(beat)) return s;
        const beats = [...cur.beats, beat];
        const completedAt = beats.length >= 5 ? Date.now() : cur.completedAt;
        const next: ProgressState = {
          ...s,
          xp: s.xp + xp,
          modules: { ...s.modules, [moduleId]: { ...cur, beats, completedAt } },
        };
        return bumpStreak(next);
      });
    },
    [bumpStreak],
  );

  const recordQuiz = useCallback((moduleId: string, score: number) => {
    setState((s) => {
      const cur = s.modules[moduleId] ?? { ...emptyModule };
      return {
        ...s,
        modules: { ...s.modules, [moduleId]: { ...cur, quiz: Math.max(cur.quiz, score) } },
      };
    });
  }, []);

  const addToDeck = useCallback((moduleId: string) => {
    setState((s) => {
      if (s.deck[moduleId]) return s;
      return { ...s, deck: { ...s.deck, [moduleId]: newCard(moduleId) } };
    });
  }, []);

  const gradeCard = useCallback(
    (moduleId: string, grade: 0 | 1 | 2 | 3) => {
      setState((s) => {
        const card = s.deck[moduleId] ?? newCard(moduleId);
        const next: ProgressState = {
          ...s,
          xp: s.xp + (grade > 0 ? 5 : 0),
          deck: { ...s.deck, [moduleId]: schedule(card, grade) },
        };
        return bumpStreak(next);
      });
    },
    [bumpStreak],
  );

  const reset = useCallback(() => {
    resetStore();
    setState(loadProgress());
  }, []);

  const moduleProgress = useCallback(
    (id: string) => state.modules[id] ?? emptyModule,
    [state.modules],
  );

  const api = useMemo<ProgressAPI>(
    () => ({
      state,
      moduleProgress,
      completeBeat,
      recordQuiz,
      addToDeck,
      gradeCard,
      reset,
    }),
    [state, moduleProgress, completeBeat, recordQuiz, addToDeck, gradeCard, reset],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressAPI {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
