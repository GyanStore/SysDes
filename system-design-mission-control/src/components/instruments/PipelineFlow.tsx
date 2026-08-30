import { useRef, useState } from "react";
import { useTicker } from "@/lib/useTicker";
import { PlayControls } from "@/components/ui/atoms";

interface Config {
  stages?: string[];
  failAt?: number; // stage index that fails when failure is injected
  caption?: string;
}

const DEFAULT_STAGES = ["Commit", "Build", "Test", "Deploy", "Live"];

type Status = "idle" | "running" | "passed" | "failed" | "rolledback";

export default function PipelineFlow({ config, accent = "#38bdf8" }: { config?: Config; accent?: string }) {
  const stages = config?.stages?.length ? config.stages : DEFAULT_STAGES;
  const failAt = config?.failAt ?? 2; // default: Test fails
  const [injectFail, setInjectFail] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>(() => stages.map(() => "idle"));
  const [active, setActive] = useState(-1);
  const done = useRef(false);
  const acc = useRef(0);

  function advance() {
    setActive((prev) => {
      const next = prev + 1;
      if (next >= stages.length) {
        done.current = true;
        return prev;
      }
      setStatuses((st) => {
        const copy = st.slice();
        if (prev >= 0) copy[prev] = copy[prev] === "failed" ? "failed" : "passed";
        if (injectFail && next === failAt) {
          copy[next] = "failed";
          done.current = true;
          // mark everything after as rolled back
          for (let i = next + 1; i < stages.length; i++) copy[i] = "idle";
        } else {
          copy[next] = "running";
        }
        return copy;
      });
      return next;
    });
  }

  const { playing, toggle } = useTicker((dt) => {
    if (done.current) return;
    acc.current += dt;
    if (acc.current >= 0.75) {
      acc.current = 0;
      advance();
    }
  });

  function reset() {
    done.current = false;
    acc.current = 0;
    setStatuses(stages.map(() => "idle"));
    setActive(-1);
  }

  const failedIdx = statuses.findIndex((s) => s === "failed");
  const color = (s: Status) =>
    s === "passed" ? "#57e389" : s === "failed" ? "#ff6b8b" : s === "running" ? accent : "#33436e";

  return (
    <div>
      <div className="panel p-4">
        <div className="flex items-stretch gap-1.5 overflow-x-auto">
          {stages.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 shrink-0">
              <div
                className="rounded-lg px-3 py-2 text-center transition-all"
                style={{
                  minWidth: 74,
                  border: `1px solid ${color(statuses[i])}`,
                  background: statuses[i] === "idle" ? "#0a1130" : `${color(statuses[i])}1f`,
                  boxShadow: statuses[i] === "running" ? `0 0 12px ${accent}66` : "none",
                }}
              >
                <div className="text-sm font-medium">{s}</div>
                <div className="text-[10px] readout" style={{ color: color(statuses[i]) }}>
                  {statuses[i] === "idle" ? "·" : statuses[i]}
                </div>
              </div>
              {i < stages.length - 1 && (
                <span style={{ color: statuses[i] === "passed" ? "#57e389" : "#33436e" }}>→</span>
              )}
            </div>
          ))}
        </div>

        {failedIdx >= 0 && (
          <div className="mt-3 panel p-2 text-sm" style={{ borderColor: "#ff6b8b" }}>
            <span style={{ color: "#ff6b8b" }}>✕ {stages[failedIdx]} failed</span> — pipeline
            halted, deploy blocked. In CD this triggers an automatic <span className="readout">rollback</span> and alerts on-call.
          </div>
        )}
        {done.current && failedIdx < 0 && active >= stages.length - 1 && (
          <div className="mt-3 panel p-2 text-sm" style={{ borderColor: "#57e389" }}>
            <span style={{ color: "#57e389" }}>✓ Shipped</span> — every gate passed, new version is live.
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PlayControls playing={playing} onToggle={toggle} onStep={() => !done.current && advance()} onReset={reset} />
        <button
          className={`btn ${injectFail ? "btn-primary" : ""}`}
          onClick={() => { setInjectFail((f) => !f); reset(); }}
        >
          Inject failure: {injectFail ? "on" : "off"}
        </button>
      </div>
      <p className="text-muted text-xs mt-3">
        Watch a change flow through the gates. Turn on <span className="readout">Inject failure</span> to see a
        failing test stop the pipeline before it reaches production — the whole point of CI/CD.
      </p>
    </div>
  );
}
