import { useState } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "@/lib/progress";
import { dueCards } from "@/lib/srs";
import { getModule } from "@/content";

const GRADES: { g: 0 | 1 | 2 | 3; label: string; color: string }[] = [
  { g: 0, label: "Forgot", color: "#ff6b8b" },
  { g: 1, label: "Hard", color: "#ffcf6e" },
  { g: 2, label: "Good", color: "#5eb0ff" },
  { g: 3, label: "Easy", color: "#57e389" },
];

export default function DeckPage() {
  const { state, gradeCard } = useProgress();
  const due = dueCards(state.deck);
  const total = Object.keys(state.deck).length;
  const [revealed, setRevealed] = useState(false);

  const card = due[0];
  const module = card ? getModule(card.moduleId) : undefined;

  function grade(g: 0 | 1 | 2 | 3) {
    if (!card) return;
    gradeCard(card.moduleId, g);
    setRevealed(false);
  }

  if (total === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-3">🗂️</div>
        <h1 className="text-xl mb-2">Your review deck is empty</h1>
        <p className="text-muted mb-6 max-w-md mx-auto">
          Finish a module's recall quiz and tap <span className="readout">“Add to review deck.”</span> Cards resurface on a
          spaced schedule so concepts stick for good.
        </p>
        <Link to="/dojo" className="btn btn-primary">Browse the Mission Map</Link>
      </div>
    );
  }

  if (!card || !module) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-3">✅</div>
        <h1 className="text-xl mb-2">All caught up</h1>
        <p className="text-muted mb-6">No cards due right now. {total} card{total > 1 ? "s" : ""} in your deck.</p>
        <Link to="/dojo" className="btn">Keep learning</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl grad-text">Review deck</h1>
        <span className="readout text-sm" style={{ color: "#ffcf6e" }}>{due.length} due · {total} total</span>
      </div>

      <div className="panel p-6 min-h-[240px] flex flex-col">
        <div className="text-[11px] uppercase tracking-wider text-muted mb-2">Recall this concept</div>
        <h2 className="text-xl mb-1">{module.title}</h2>
        <p className="text-muted text-sm">{module.tagline}</p>

        {!revealed ? (
          <div className="mt-auto pt-6">
            <p className="text-muted text-sm mb-4">Say the idea and its main trade-off out loud, then reveal.</p>
            <button className="btn btn-primary w-full" onClick={() => setRevealed(true)}>Reveal</button>
          </div>
        ) : (
          <div className="mt-4">
            <div className="panel p-3 mb-2 bg-[#0a1130]">
              <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Analogy</div>
              <p className="text-sm">{module.memory.analogy}</p>
            </div>
            <div className="panel p-3 mb-4 bg-[#0a1130]">
              <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Trade-off</div>
              <p className="text-sm">{module.tradeoff.consequence}</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {GRADES.map((g) => (
                <button key={g.g} className="btn" style={{ borderColor: g.color, color: g.color }} onClick={() => grade(g.g)}>
                  {g.label}
                </button>
              ))}
            </div>
            <Link to={`/learn/${module.id}`} className="text-muted text-xs mt-3 inline-block hover:text-ink">Open full module →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
