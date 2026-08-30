import { useState } from "react";
import { Labeled, StatTile } from "@/components/ui/atoms";

function human(n: number, unit = ""): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T${unit}`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B${unit}`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M${unit}`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K${unit}`;
  return `${n.toFixed(0)}${unit}`;
}

function bytes(n: number): string {
  if (n >= 1e15) return `${(n / 1e15).toFixed(1)} PB`;
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)} TB`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} GB`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} MB`;
  return `${(n / 1e3).toFixed(1)} KB`;
}

function CapacityPad({ accent }: { accent: string }) {
  const [dauM, setDauM] = useState(100); // million DAU
  const [actions, setActions] = useState(10); // actions/user/day
  const [payloadKB, setPayloadKB] = useState(2); // KB per write
  const [retention, setRetention] = useState(365); // days
  const [peak, setPeak] = useState(3);

  const dau = dauM * 1e6;
  const perDay = dau * actions;
  const avgQps = perDay / 86400;
  const peakQps = avgQps * peak;
  const storagePerDay = perDay * payloadKB * 1000; // bytes/day (assume each action writes payload)
  const storageTotal = storagePerDay * retention;
  const bandwidth = peakQps * payloadKB * 1000 * 8; // bits/s

  return (
    <div className="panel p-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Labeled label="Daily active users" value={`${dauM}M`}>
          <input type="range" min={1} max={1000} value={dauM} onChange={(e) => setDauM(+e.target.value)} className="w-full" style={{ accentColor: accent }} />
        </Labeled>
        <Labeled label="Actions / user / day" value={String(actions)}>
          <input type="range" min={1} max={100} value={actions} onChange={(e) => setActions(+e.target.value)} className="w-full" style={{ accentColor: accent }} />
        </Labeled>
        <Labeled label="Payload per write" value={`${payloadKB} KB`}>
          <input type="range" min={1} max={100} value={payloadKB} onChange={(e) => setPayloadKB(+e.target.value)} className="w-full" style={{ accentColor: accent }} />
        </Labeled>
        <Labeled label="Retention" value={`${retention} days`}>
          <input type="range" min={30} max={1825} step={5} value={retention} onChange={(e) => setRetention(+e.target.value)} className="w-full" style={{ accentColor: accent }} />
        </Labeled>
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        <StatTile label="Requests/day" value={human(perDay)} />
        <StatTile label="Avg QPS" value={human(avgQps)} tone={accent} />
        <StatTile label={`Peak QPS (×${peak})`} value={human(peakQps)} tone="#ffcf6e" />
        <StatTile label="Storage / day" value={bytes(storagePerDay)} />
        <StatTile label="Storage total" value={bytes(storageTotal)} tone="#b79bff" />
        <StatTile label="Peak bandwidth" value={`${human(bandwidth)}bps`} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-muted">Peak factor</span>
        {[2, 3, 5, 10].map((p) => (
          <button key={p} className={`btn ${peak === p ? "btn-primary" : ""}`} onClick={() => setPeak(p)}>×{p}</button>
        ))}
      </div>
      <p className="text-muted text-xs mt-3">
        Rule of thumb: <span className="readout">~86,400 s/day</span>. Divide daily counts by it for average/sec,
        then multiply by a peak factor for capacity.
      </p>
    </div>
  );
}

const NINES = [
  { label: "90% (one nine)", v: 0.9 },
  { label: "99% (two nines)", v: 0.99 },
  { label: "99.9% (three nines)", v: 0.999 },
  { label: "99.99% (four nines)", v: 0.9999 },
  { label: "99.999% (five nines)", v: 0.99999 },
];

function NinesPad({ accent }: { accent: string }) {
  const [idx, setIdx] = useState(2);
  const [deps, setDeps] = useState(3);
  const a = NINES[idx].v;
  const yearMin = (1 - a) * 365 * 24 * 60;
  const monthMin = (1 - a) * 30 * 24 * 60;
  const dayMs = (1 - a) * 24 * 60 * 60 * 1000;
  const series = Math.pow(a, deps);
  const seriesYearMin = (1 - series) * 365 * 24 * 60;

  function fmtMin(m: number): string {
    if (m >= 1440) return `${(m / 1440).toFixed(1)} days`;
    if (m >= 60) return `${(m / 60).toFixed(1)} hours`;
    if (m >= 1) return `${m.toFixed(1)} min`;
    return `${(m * 60).toFixed(0)} sec`;
  }

  return (
    <div className="panel p-4">
      <Labeled label="Target availability">
        <select value={idx} onChange={(e) => setIdx(+e.target.value)} className="bg-[#0a1130] border border-line rounded-lg px-3 py-2 text-ink">
          {NINES.map((n, i) => <option key={i} value={i}>{n.label}</option>)}
        </select>
      </Labeled>
      <div className="flex flex-wrap gap-2 mt-4">
        <StatTile label="Downtime / year" value={fmtMin(yearMin)} tone={accent} />
        <StatTile label="Downtime / month" value={fmtMin(monthMin)} />
        <StatTile label="Downtime / day" value={`${(dayMs / 1000).toFixed(1)} s`} />
      </div>

      <div className="mt-5">
        <Labeled label="Dependencies in series" value={String(deps)}>
          <input type="range" min={1} max={10} value={deps} onChange={(e) => setDeps(+e.target.value)} className="w-full" style={{ accentColor: accent }} />
        </Labeled>
        <div className="flex flex-wrap gap-2 mt-3">
          <StatTile label={`Combined (${deps} in series)`} value={`${(series * 100).toFixed(3)}%`} tone="#ff6b8b" />
          <StatTile label="Combined downtime/yr" value={fmtMin(seriesYearMin)} tone="#ff6b8b" />
        </div>
        <p className="text-muted text-xs mt-3">
          Availability multiplies down a call chain: {deps} services each at {NINES[idx].label.split(" ")[0]} give only{" "}
          <span className="readout" style={{ color: "#ff6b8b" }}>{(series * 100).toFixed(3)}%</span> together.
        </p>
      </div>
    </div>
  );
}

export default function EstimatorPad({ config, accent = "#5eb0ff" }: { config?: { mode?: string }; accent?: string }) {
  return config?.mode === "nines" ? <NinesPad accent={accent} /> : <CapacityPad accent={accent} />;
}
