import { useState } from "react";
import type { Tradeoff } from "@/types/content";

export default function TradeoffLab({ tradeoff, accent = "#5eb0ff" }: { tradeoff?: Tradeoff; accent?: string }) {
  const [v, setV] = useState(50);
  if (!tradeoff) {
    return <div className="panel p-4 text-muted text-sm">Trade-off data unavailable.</div>;
  }
  const leftPct = 100 - v;
  const rightPct = v;
  const favor = v < 40 ? "left" : v > 60 ? "right" : "mid";

  return (
    <div className="panel p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted mb-3">{tradeoff.axis}</div>

      <div className="flex justify-between text-sm mb-1">
        <span style={{ color: favor === "left" ? accent : "var(--muted)", fontWeight: favor === "left" ? 700 : 400 }}>
          ◀ {tradeoff.left}
        </span>
        <span style={{ color: favor === "right" ? accent : "var(--muted)", fontWeight: favor === "right" ? 700 : 400 }}>
          {tradeoff.right} ▶
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: accent }}
        aria-label={tradeoff.axis}
      />

      {/* competing meters */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Meter label={tradeoff.left} pct={leftPct} color="#6bf0c8" />
        <Meter label={tradeoff.right} pct={rightPct} color="#ffcf6e" />
      </div>

      <div className="mt-4 panel p-3 bg-[#0a1130]">
        <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Consequence</div>
        <p className="text-sm text-ink">{tradeoff.consequence}</p>
        <p className="text-xs text-muted mt-2">
          {favor === "left" && `You're favoring "${tradeoff.left}".`}
          {favor === "right" && `You're favoring "${tradeoff.right}".`}
          {favor === "mid" && "You're balancing both — most real systems live near here, tuned to the workload."}
        </p>
      </div>
    </div>
  );
}

function Meter({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="text-[10px] text-muted mb-1 truncate">{label}</div>
      <div className="h-2.5 rounded-full bg-[#0a1130] border border-line overflow-hidden">
        <div className="h-full rounded-full transition-[width] duration-100" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
