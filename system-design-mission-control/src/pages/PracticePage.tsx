import { Link } from "react-router-dom";
import { modulesForBelt } from "@/content";
import { useProgress } from "@/lib/progress";

export default function PracticePage() {
  const cases = modulesForBelt("case-studies");
  const { moduleProgress } = useProgress();

  return (
    <div>
      <h1 className="text-3xl grad-text mb-1">Practice · Design Simulator</h1>
      <p className="text-muted mb-6">
        Build real systems step by step, with trade-off checkpoints and a "how the real one does it" reveal.
        Great for interview prep or pressure-testing your instincts.
      </p>

      <div className="panel p-4 mb-8" style={{ borderColor: "#57e38955" }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🧩</span>
          <h2 className="font-semibold">Drag-and-drop design canvas</h2>
          <span className="chip" style={{ color: "#ffcf6e", borderColor: "#ffcf6e" }}>on the roadmap</span>
        </div>
        <p className="text-muted text-sm">
          A whiteboard where you drag components (LB, cache, DB, queue…), wire them up, and get automated feedback
          on bottlenecks and single points of failure. For now, each case study below walks you through the design interactively.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {cases.map((m, i) => {
          const done = moduleProgress(m.id).beats.length >= 5;
          return (
            <Link key={m.id} to={`/learn/${m.id}`} className="panel p-4 hover:-translate-y-0.5 transition-transform" style={{ borderColor: done ? "#57e38988" : undefined }}>
              <div className="flex items-start gap-3">
                <span className="grid place-items-center w-8 h-8 rounded-lg font-bold shrink-0" style={{ background: "#57e38922", color: "#57e389" }}>{i + 1}</span>
                <div>
                  <div className="font-medium flex items-center gap-1">{m.title} {done && <span style={{ color: "#57e389" }}>✓</span>}</div>
                  <p className="text-muted text-sm mt-0.5">{m.tagline}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
