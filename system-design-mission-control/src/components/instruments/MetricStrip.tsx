import { useState } from "react";
import { Labeled, StatTile } from "@/components/ui/atoms";

function Bar({ pct, color, label }: { pct: number; color: string; label: string }) {
  return (
    <div>
      <div className="text-[10px] text-muted mb-1">{label}</div>
      <div className="h-3 rounded-full bg-[#0a1130] border border-line overflow-hidden">
        <div className="h-full rounded-full transition-[width] duration-150" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
      </div>
    </div>
  );
}

export default function MetricStrip({ config, accent = "#5eb0ff" }: { config?: { mode?: string }; accent?: string }) {
  const mode = config?.mode ?? "batching";

  if (mode === "llm") {
    return <LlmStrip accent={accent} />;
  }
  return <BatchStrip accent={accent} />;
}

function BatchStrip({ accent }: { accent: string }) {
  const [batch, setBatch] = useState(8);
  // sublinear per-item cost: bigger batches amortize fixed overhead
  const procMs = 18 + batch * 0.7; // GPU time for the whole batch
  const fillWaitMs = batch * 1.5; // time to wait to fill the batch
  const p50 = procMs + fillWaitMs * 0.5;
  const p99 = procMs + fillWaitMs;
  const throughput = (batch / procMs) * 1000; // req/s
  const gpuUtil = Math.min(100, (batch / 40) * 100);

  return (
    <div className="panel p-4">
      <Labeled label="Max batch size" value={String(batch)}>
        <input type="range" min={1} max={64} value={batch} onChange={(e) => setBatch(+e.target.value)} className="w-full" style={{ accentColor: accent }} />
      </Labeled>
      <div className="flex flex-wrap gap-2 mt-4">
        <StatTile label="Throughput" value={`${throughput.toFixed(0)} req/s`} tone="#57e389" />
        <StatTile label="Latency p50" value={`${p50.toFixed(0)} ms`} tone={accent} />
        <StatTile label="Latency p99" value={`${p99.toFixed(0)} ms`} tone="#ffcf6e" />
        <StatTile label="GPU util" value={`${gpuUtil.toFixed(0)}%`} tone="#b79bff" />
      </div>
      <div className="mt-4 space-y-3">
        <Bar pct={(throughput / 1000) * 100} color="#57e389" label="throughput" />
        <Bar pct={(p99 / 120) * 100} color="#ffcf6e" label="p99 latency (lower is better)" />
        <Bar pct={gpuUtil} color="#b79bff" label="GPU utilization" />
      </div>
      <p className="text-muted text-xs mt-3">
        Bigger batches push <span className="readout" style={{ color: "#57e389" }}>throughput</span> and{" "}
        <span className="readout" style={{ color: "#b79bff" }}>GPU utilization</span> up — but requests wait longer to fill the batch, so{" "}
        <span className="readout" style={{ color: "#ffcf6e" }}>p99 latency</span> climbs. Tune to your SLO.
      </p>
    </div>
  );
}

function LlmStrip({ accent }: { accent: string }) {
  const [conc, setConc] = useState(8);
  // total tokens/s saturates; per-request tokens/s falls as concurrency rises
  const totalToks = 2500 * (1 - Math.exp(-conc / 12));
  const perReq = totalToks / conc;
  const gpuUtil = Math.min(100, (conc / 32) * 100);

  return (
    <div className="panel p-4">
      <Labeled label="Concurrent requests (continuous batching)" value={String(conc)}>
        <input type="range" min={1} max={48} value={conc} onChange={(e) => setConc(+e.target.value)} className="w-full" style={{ accentColor: accent }} />
      </Labeled>
      <div className="flex flex-wrap gap-2 mt-4">
        <StatTile label="Total tokens/s" value={`${totalToks.toFixed(0)}`} tone="#57e389" />
        <StatTile label="Per-request tok/s" value={`${perReq.toFixed(0)}`} tone={accent} />
        <StatTile label="GPU util" value={`${gpuUtil.toFixed(0)}%`} tone="#b79bff" />
      </div>
      <div className="mt-4 space-y-3">
        <Bar pct={(totalToks / 2500) * 100} color="#57e389" label="aggregate throughput" />
        <Bar pct={(perReq / 300) * 100} color={accent} label="per-request speed (falls with load)" />
        <Bar pct={gpuUtil} color="#b79bff" label="GPU utilization" />
      </div>
      <p className="text-muted text-xs mt-3">
        Continuous batching packs more concurrent generations onto the GPU — aggregate{" "}
        <span className="readout" style={{ color: "#57e389" }}>tokens/s</span> rises and utilization climbs, but each
        individual request gets <span className="readout" style={{ color: accent }}>fewer tok/s</span> as they share compute.
      </p>
    </div>
  );
}
