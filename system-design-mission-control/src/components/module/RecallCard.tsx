import { useState } from "react";
import type { ModuleContent } from "@/types/content";
import { useProgress } from "@/lib/progress";

export default function RecallCard({ module, accent }: { module: ModuleContent; accent: string }) {
  const { recordQuiz, addToDeck, completeBeat, state } = useProgress();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flipped, setFlipped] = useState(false);
  const inDeck = !!state.deck[module.id];

  const answered = Object.keys(answers).length;
  const correct = module.recall.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
  const done = answered === module.recall.length;

  function choose(qi: number, oi: number) {
    if (answers[qi] != null) return; // lock once answered
    const next = { ...answers, [qi]: oi };
    setAnswers(next);
    const nowDone = Object.keys(next).length === module.recall.length;
    if (nowDone) {
      const score = module.recall.reduce((n, q, i) => n + (next[i] === q.answer ? 1 : 0), 0) / module.recall.length;
      recordQuiz(module.id, score);
      completeBeat(module.id, "recall");
    }
  }

  return (
    <div className="space-y-5">
      {/* quiz */}
      <div className="space-y-4">
        {module.recall.map((q, qi) => {
          const chosen = answers[qi];
          const isAnswered = chosen != null;
          return (
            <div key={qi} className="panel p-4">
              <div className="font-medium mb-3">{q.q}</div>
              <div className="grid gap-2">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.answer;
                  const isChosen = chosen === oi;
                  let border = "var(--line)";
                  let bg = "rgba(10,17,40,0.6)";
                  if (isAnswered && isCorrect) {
                    border = "#57e389";
                    bg = "rgba(87,227,137,0.12)";
                  } else if (isAnswered && isChosen && !isCorrect) {
                    border = "#ff6b8b";
                    bg = "rgba(255,107,139,0.12)";
                  }
                  return (
                    <button
                      key={oi}
                      onClick={() => choose(qi, oi)}
                      disabled={isAnswered}
                      className="text-left rounded-lg px-3 py-2 text-sm border transition-colors"
                      style={{ borderColor: border, background: bg, cursor: isAnswered ? "default" : "pointer" }}
                    >
                      <span className="readout mr-2 text-muted">{String.fromCharCode(65 + oi)}</span>
                      {opt}
                      {isAnswered && isCorrect && <span className="float-right text-[#57e389]">✓</span>}
                      {isAnswered && isChosen && !isCorrect && <span className="float-right text-[#ff6b8b]">✕</span>}
                    </button>
                  );
                })}
              </div>
              {isAnswered && <p className="text-muted text-xs mt-3 border-l-2 pl-3" style={{ borderColor: accent }}>{q.explain}</p>}
            </div>
          );
        })}
      </div>

      {done && (
        <div className="panel p-3 flex items-center justify-between flex-wrap gap-2" style={{ borderColor: accent }}>
          <span className="text-sm">
            Score: <span className="readout" style={{ color: accent }}>{correct}/{module.recall.length}</span>
          </span>
          <button
            className={`btn ${inDeck ? "" : "btn-primary"}`}
            onClick={() => addToDeck(module.id)}
            disabled={inDeck}
          >
            {inDeck ? "✓ In your review deck" : "+ Add to review deck"}
          </button>
        </div>
      )}

      {/* memory hook flip card */}
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted mb-2">Memory hook</div>
        <button
          className="panel p-4 w-full text-left"
          onClick={() => setFlipped((f) => !f)}
          style={{ borderColor: accent }}
        >
          {!flipped ? (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Analogy</div>
              <p className="text-sm">{module.memory.analogy}</p>
              <p className="text-xs text-muted mt-2">Tap to see why it exists →</p>
            </div>
          ) : (
            <div>
              {module.memory.mnemonic && (
                <>
                  <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Mnemonic</div>
                  <p className="text-sm readout" style={{ color: accent }}>{module.memory.mnemonic}</p>
                </>
              )}
              <div className="text-[10px] uppercase tracking-wider text-muted mb-1 mt-2">Why it exists</div>
              <p className="text-sm">{module.memory.why}</p>
              <p className="text-xs text-muted mt-2">← Tap to flip back</p>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
