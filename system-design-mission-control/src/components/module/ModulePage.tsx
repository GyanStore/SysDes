import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ModuleContent, Depth } from "@/types/content";
import { BELT_BY_ID, neighbors, getModule } from "@/content";
import { useProgress } from "@/lib/progress";
import InstrumentMount from "@/components/instruments/InstrumentMount";
import RecallCard from "./RecallCard";
import { Chip } from "@/components/ui/atoms";

const DEPTHS: { key: Depth; label: string; icon: string; desc: string }[] = [
  { key: "napkin", label: "Napkin", icon: "✏️", desc: "The one idea, in plain words — a fast mental model." },
  { key: "working", label: "Working", icon: "⚙️", desc: "The moving parts and the main trade-off." },
  { key: "deep", label: "Deep dive", icon: "🔬", desc: "Algorithms, failure modes, real numbers — plus 'Under the hood' details." },
];

function UnderTheHood({ module, accent }: { module: ModuleContent; accent: string }) {
  const prereqs = (module.prereqs ?? []).map(getModule).filter((m): m is ModuleContent => !!m);
  const hasBullets = !!module.deepDive?.length;
  return (
    <div className="panel p-4 mb-4" style={{ borderColor: accent }}>
      <div className="text-[11px] uppercase tracking-wider mb-2" style={{ color: accent }}>
        🔬 Under the hood
      </div>
      {hasBullets ? (
        <ul className="space-y-1.5 text-sm mb-1">
          {module.deepDive!.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span style={{ color: accent }} className="shrink-0">▹</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">
          The deeper mechanics are covered in the explanation above — then pressure-test them in the sandbox below.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {module.tags.map((t) => (
          <span key={t} className="chip">{t}</span>
        ))}
      </div>
      {prereqs.length > 0 && (
        <div className="mt-3 text-xs text-muted">
          Prerequisites:{" "}
          {prereqs.map((p, i) => (
            <span key={p.id}>
              <Link to={`/learn/${p.id}`} className="underline hover:text-ink" style={{ color: accent }}>{p.title}</Link>
              {i < prereqs.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Beat({ n, title, accent, children }: { n: number; title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-9 reveal">
      <div className="flex items-center gap-3 mb-3">
        <span
          className="grid place-items-center w-7 h-7 rounded-full text-[13px] font-bold shrink-0"
          style={{ background: accent, color: "#06122a" }}
        >
          {n}
        </span>
        <h2 className="text-lg">{title}</h2>
      </div>
      <div className="pl-10">{children}</div>
    </section>
  );
}

export default function ModulePage({ module }: { module: ModuleContent }) {
  const belt = BELT_BY_ID[module.beltId];
  const accent = belt?.color ?? "#5eb0ff";
  const [depth, setDepth] = useState<Depth>("working");
  const { completeBeat, moduleProgress } = useProgress();
  const prog = moduleProgress(module.id);
  const { prev, next } = neighbors(module.id);

  useEffect(() => {
    // These beats are presented on load; recall is completed via the quiz.
    completeBeat(module.id, "hook");
    completeBeat(module.id, "animate");
    completeBeat(module.id, "sandbox");
    completeBeat(module.id, "tradeoff");
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module.id]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* header */}
      <div className="mb-2 flex items-center gap-2 flex-wrap">
        <Link to="/dojo" className="text-muted text-sm hover:text-ink">← Mission map</Link>
        <span className="text-muted">/</span>
        <Chip color={accent}>{belt?.rank} · {module.code}</Chip>
        {prog.beats.length >= 5 && <Chip color="#57e389">✓ complete</Chip>}
      </div>
      <h1 className="text-3xl grad-text mb-1">{module.title}</h1>
      <p className="text-muted mb-8">{module.tagline}</p>

      {/* Beat 1 — Hook */}
      <Beat n={1} title="The problem" accent={accent}>
        <div className="panel p-4 text-[15px] leading-relaxed" style={{ borderColor: accent }}>
          {module.hook}
        </div>
      </Beat>

      {/* Beat 2/3 — Animate + explain with depth tiers */}
      <Beat n={2} title="See it move" accent={accent}>
        <div className="text-[11px] uppercase tracking-wider text-muted mb-2">
          Explanation depth — read it your way
        </div>
        <div className="flex gap-2 mb-2 flex-wrap">
          {DEPTHS.map((d) => (
            <button
              key={d.key}
              className={`btn ${depth === d.key ? "btn-primary" : ""}`}
              onClick={() => setDepth(d.key)}
              aria-pressed={depth === d.key}
            >
              <span className="mr-1">{d.icon}</span>
              {d.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted mb-3 italic">{DEPTHS.find((d) => d.key === depth)?.desc}</p>

        {/* content re-mounts on depth change so it fades in */}
        <div key={depth} className="fade-in">
          <p className="text-[15px] leading-relaxed mb-4">{module.tiers[depth]}</p>
          {depth === "deep" && <UnderTheHood module={module} accent={accent} />}
        </div>

        <div className="text-[11px] uppercase tracking-wider text-muted mb-2 mt-6">
          🎮 Interactive sandbox — same for every level, grab the controls
        </div>
        <InstrumentMount module={module} accent={accent} />
      </Beat>

      {/* Beat 4 — Trade-off */}
      <Beat n={3} title="The trade-off" accent={accent}>
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted mb-2">{module.tradeoff.axis}</div>
          <div className="flex items-center gap-3 text-sm mb-3">
            <span className="px-2 py-1 rounded-md" style={{ background: "rgba(107,240,200,0.12)", color: "#6bf0c8" }}>{module.tradeoff.left}</span>
            <span className="text-muted">↔</span>
            <span className="px-2 py-1 rounded-md" style={{ background: "rgba(255,207,110,0.12)", color: "#ffcf6e" }}>{module.tradeoff.right}</span>
          </div>
          <p className="text-sm leading-relaxed">{module.tradeoff.consequence}</p>
        </div>
      </Beat>

      {/* Beat 5 — Recall */}
      <Beat n={4} title="Lock it in" accent={accent}>
        <RecallCard module={module} accent={accent} />
      </Beat>

      {/* nav */}
      <div className="flex justify-between gap-3 mt-10 pt-6 border-t border-line">
        {prev ? (
          <Link to={`/learn/${prev.id}`} className="btn max-w-[48%]">
            <span className="text-muted text-xs block">← {BELT_BY_ID[prev.beltId]?.rank}</span>
            <span className="truncate block">{prev.title}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/learn/${next.id}`} className="btn btn-primary max-w-[48%] text-right">
            <span className="text-xs block opacity-70">{BELT_BY_ID[next.beltId]?.rank} →</span>
            <span className="truncate block">{next.title}</span>
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
