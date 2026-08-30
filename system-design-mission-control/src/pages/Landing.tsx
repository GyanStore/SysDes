import { Link } from "react-router-dom";
import { BELTS, TOTAL_MODULES } from "@/content";
import { useProgress } from "@/lib/progress";

const FEATURES = [
  { icon: "🎬", title: "Watch it move", body: "Every concept plays out as a live animation — packets flow, nodes die, clusters heal. Motion you remember." },
  { icon: "🎮", title: "Grab the controls", body: "Turn the traffic dial, kill a server, flip consistency vs availability. The system reacts in real time." },
  { icon: "⚖️", title: "Think in trade-offs", body: "Each lesson lands on a decision, not a definition. System design is strategy: scale, robustness, cost." },
  { icon: "🧠", title: "Actually remember", body: "Active recall, analogies, and a spaced-repetition deck so it sticks long after you close the tab." },
];

export default function Landing() {
  const { state } = useProgress();
  const done = Object.values(state.modules).filter((m) => m.beats.length >= 5).length;

  return (
    <div>
      {/* hero */}
      <section className="text-center py-10 sm:py-16">
        <div className="reveal">
          <span className="chip">Mission Control · System Design</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold mt-5 leading-[1.05]">
            <span className="grad-text">Learn systems</span>
            <br />
            by watching them <span className="grad-text">breathe, break & heal.</span>
          </h1>
          <p className="text-muted max-w-2xl mx-auto mt-5 text-lg">
            An interactive, animation-first way for engineers at any level to master system design,
            distributed-systems algorithms, and AI architectures — the strategy of building at scale.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <Link to="/dojo" className="btn btn-primary text-base px-6 py-3">🚀 Launch mission map</Link>
            <Link to="/learn/consistent-hashing" className="btn text-base px-6 py-3">▶ Try the flagship demo</Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted">
            <span><span className="readout" style={{ color: "#5eb0ff" }}>{TOTAL_MODULES}</span> modules</span>
            <span><span className="readout" style={{ color: "#6bf0c8" }}>{BELTS.length}</span> clearance ranks</span>
            <span><span className="readout" style={{ color: "#ff6b8b" }}>{done}</span> completed by you</span>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {FEATURES.map((f, i) => (
          <div key={f.title} className="panel p-5 reveal" style={{ animationDelay: `${100 + i * 60}ms` }}>
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-muted text-sm">{f.body}</p>
          </div>
        ))}
      </section>

      {/* ranks preview */}
      <section className="mt-14">
        <h2 className="text-xl mb-1">The clearance ladder</h2>
        <p className="text-muted text-sm mb-5">Seven ranks, from first principles to AI infrastructure. Jump in anywhere.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BELTS.map((b) => (
            <Link key={b.id} to="/dojo" className="panel p-4 hover:-translate-y-0.5 transition-transform" style={{ borderColor: `${b.color}44` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} />
                <span className="text-[11px] uppercase tracking-wider" style={{ color: b.color }}>{b.rank}</span>
              </div>
              <div className="font-semibold text-sm">{b.name}</div>
              <p className="text-muted text-xs mt-1 line-clamp-2">{b.blurb}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
