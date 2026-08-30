/**
 * Spaced-repetition scheduling (SM-2-lite).
 * Grades: 0 = forgot, 1 = hard, 2 = good, 3 = easy.
 */
import type { DeckCard } from "./storage";

const DAY = 24 * 60 * 60 * 1000;

export function newCard(moduleId: string, now = Date.now()): DeckCard {
  return { moduleId, ease: 2.3, intervalDays: 0, due: now, reps: 0 };
}

export function schedule(card: DeckCard, grade: 0 | 1 | 2 | 3, now = Date.now()): DeckCard {
  let { ease, intervalDays, reps } = card;

  if (grade === 0) {
    // failed — reset interval, drop ease
    ease = Math.max(1.3, ease - 0.2);
    intervalDays = 1;
    reps = 0;
  } else {
    ease = Math.min(2.8, ease + (grade - 2) * 0.12);
    reps += 1;
    if (reps === 1) intervalDays = 1;
    else if (reps === 2) intervalDays = 3;
    else intervalDays = Math.round(intervalDays * ease);
    if (grade === 1) intervalDays = Math.max(1, Math.round(intervalDays * 0.6));
  }

  return {
    ...card,
    ease: Number(ease.toFixed(2)),
    intervalDays,
    reps,
    due: now + intervalDays * DAY,
  };
}

export function dueCards(deck: Record<string, DeckCard>, now = Date.now()): DeckCard[] {
  return Object.values(deck)
    .filter((c) => c.due <= now)
    .sort((a, b) => a.due - b.due);
}
