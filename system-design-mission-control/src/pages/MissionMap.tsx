import { Link } from "react-router-dom";
import { BELTS, modulesForBelt, TOTAL_MODULES } from "@/content";
import { useProgress } from "@/lib/progress";
import Galaxy from "@/components/space/Galaxy";

export default function MissionMap() {
  const { moduleProgress } = useProgress();

  const beltStats = BELTS.map((b) => {
    const modules = modulesForBelt(b.id);
    const done = modules.filter((m) => moduleProgress(m.id).beats.length >= 5).length;
    return { belt: b, modules, done, complete: done === modules.length && modules.length > 0 };
  });

  const totalDone = beltStats.reduce((n, s) => n + s.done, 0);
  const galaxiesReached = beltStats.filter((s) => s.complete).length;
  // "you are here" = first rank not yet complete
  const currentIdx = beltStats.findIndex((s) => !s.complete);

  return (
    <div>
      {/* voyage hero */}
      <div className="reveal mb-8">
        <span className="chip">Flight Plan</span>
        <h1 className="text-3xl sm:text-4xl grad-text mt-3">The Voyage</h1>
        <p className="text-muted mt-1 max-w-2xl">
          Chart a course across nine galaxies — from first principles to AI infrastructure.
          Complete a galaxy's systems to light it up and travel onward.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="panel px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-muted">Galaxies reached</div>
            <div className="readout text-lg" style={{ color: "#6bf0c8" }}>{galaxiesReached}/{BELTS.length}</div>
          </div>
          <div className="panel px-3 py-2 flex-1 min-w-[180px]">
            <div className="text-[10px] uppercase tracking-wider text-muted mb-1">
              Systems mastered · <span className="readout" style={{ color: "#5eb0ff" }}>{totalDone}/{TOTAL_MODULES}</span>
            </div>
            <div className="h-2 rounded-full bg-[#0a1130] overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-700"
                style={{ width: `${(totalDone / TOTAL_MODULES) * 100}%`, background: "linear-gradient(90deg,#5eb0ff,#6bf0c8)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* the route */}
      <div className="voyage">
        <div className="voyage-spine" />
        <span className="comet" style={{ animationDuration: "7s", animationDelay: "0s" }} />
        <span className="comet" style={{ animationDuration: "11s", animationDelay: "3.5s" }} />
        <span className="comet" style={{ animationDuration: "9s", animationDelay: "6s" }} />

        {beltStats.map(({ belt, modules, done, complete }, bi) => {
          const isCurrent = bi === currentIdx;
          return (
            <section
              key={belt.id}
              className="reveal relative pb-12"
              style={{ animationDelay: `${Math.min(bi * 50, 300)}ms` }}
            >
              <div className="flex gap-4 sm:gap-6 items-start">
                {/* waypoint marker (sits on the spine) */}
                <div className="relative shrink-0" style={{ width: 70 }}>
                  <div
                    className="relative grid place-items-center rounded-full"
                    style={{
                      width: 64,
                      height: 64,
                      marginLeft: 3,
                      background: "radial-gradient(circle, rgba(10,17,40,0.2), rgba(6,10,22,0.85))",
                      boxShadow: complete
                        ? `0 0 22px ${belt.color}aa, inset 0 0 0 1px ${belt.color}`
                        : `0 0 14px ${belt.color}55, inset 0 0 0 1px ${belt.color}66`,
                      opacity: complete || isCurrent ? 1 : 0.9,
                    }}
                  >
                    <Galaxy color={belt.color} size={60} dim={!complete && !isCurrent} />
                    {/* status badge */}
                    {complete && (
                      <span
                        className="absolute -right-1 -top-1 grid place-items-center rounded-full text-[11px] font-bold"
                        style={{ width: 20, height: 20, background: belt.color, color: "#06122a" }}
                      >
                        ✓
                      </span>
                    )}
                    {isCurrent && (
                      <span
                        className="absolute -right-2 -top-3 text-xl"
                        style={{ filter: `drop-shadow(0 0 6px ${belt.color})` }}
                        title="You are here"
                      >
                        🚀
                      </span>
                    )}
                  </div>
                </div>

                {/* waypoint body */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] uppercase tracking-widest" style={{ color: belt.color }}>
                      {belt.rank}
                    </span>
                    {isCurrent && <span className="chip" style={{ color: belt.color, borderColor: belt.color }}>you are here</span>}
                    {complete && <span className="chip" style={{ color: "#6bf0c8", borderColor: "#6bf0c8" }}>cleared</span>}
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl">{belt.name}</h2>
                    <span className="readout text-sm" style={{ color: belt.color }}>{done}/{modules.length}</span>
                  </div>
                  <p className="text-muted text-sm mt-0.5">{belt.blurb}</p>

                  {/* progress rail */}
                  <div className="h-1 rounded-full bg-[#0a1130] my-3 overflow-hidden max-w-md">
                    <div
                      className="h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${(done / modules.length) * 100}%`, background: belt.color }}
                    />
                  </div>

                  {/* systems (module tiles) */}
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                    {modules.map((m, i) => {
                      const p = moduleProgress(m.id);
                      const isDone = p.beats.length >= 5;
                      return (
                        <Link
                          key={m.id}
                          to={`/learn/${m.id}`}
                          className="panel p-3 group hover:-translate-y-0.5 transition-transform"
                          style={{ borderColor: isDone ? `${belt.color}88` : undefined }}
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className="mt-1 shrink-0 rounded-full"
                              style={{
                                width: 7,
                                height: 7,
                                background: isDone ? belt.color : "#33436e",
                                boxShadow: isDone ? `0 0 8px ${belt.color}` : "none",
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm leading-snug group-hover:text-ink flex items-center gap-1">
                                <span className="readout text-xs text-muted">{belt.code}.{i + 1}</span> {m.title}
                                {isDone && <span style={{ color: belt.color }}>✓</span>}
                              </div>
                              <p className="text-muted text-xs mt-0.5 line-clamp-2">{m.tagline}</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
