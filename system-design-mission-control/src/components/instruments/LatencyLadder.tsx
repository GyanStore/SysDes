import { useEffect, useState } from "react";

interface Row {
  label: string;
  ns: number;
  real: string;
  human: string;
}

// "If 1 nanosecond were 1 second…" — scale factor 1e9.
const ROWS: Row[] = [
  { label: "L1 cache reference", ns: 1, real: "1 ns", human: "1 second" },
  { label: "L2 cache reference", ns: 4, real: "4 ns", human: "4 seconds" },
  { label: "Main memory (RAM)", ns: 100, real: "100 ns", human: "1.7 minutes" },
  { label: "SSD random read", ns: 16000, real: "16 µs", human: "4.4 hours" },
  { label: "Same-datacenter round trip", ns: 500000, real: "500 µs", human: "5.8 days" },
  { label: "HDD disk seek", ns: 2000000, real: "2 ms", human: "23 days" },
  { label: "Cross-continent round trip", ns: 150000000, real: "150 ms", human: "4.7 years" },
];

export default function LatencyLadder({ accent = "#5eb0ff" }: { accent?: string }) {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const maxLog = Math.log10(ROWS[ROWS.length - 1].ns);

  return (
    <div className="panel p-4">
      <div className="space-y-3">
        {ROWS.map((r, i) => {
          const w = 4 + (Math.log10(r.ns) / maxLog) * 96;
          const hot = i >= 4;
          return (
            <div key={r.label}>
              <div className="flex justify-between items-baseline text-xs mb-1">
                <span className="text-ink">{r.label}</span>
                <span className="readout" style={{ color: hot ? "#ff6b8b" : accent }}>{r.real}</span>
              </div>
              <div className="h-4 rounded-md bg-[#0a1130] border border-line overflow-hidden relative">
                <div
                  className="h-full rounded-md transition-[width] duration-700 ease-out flex items-center justify-end pr-2"
                  style={{
                    width: grown ? `${w}%` : "2%",
                    background: `linear-gradient(90deg, ${hot ? "#ff6b8b55" : "#5eb0ff44"}, ${hot ? "#ff6b8b" : accent})`,
                  }}
                >
                  <span className="text-[10px] text-[#06122a] font-bold whitespace-nowrap">{r.human}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-muted text-xs mt-4">
        Bars are on a <span className="readout">log scale</span>. The right column re-scales each latency as if
        <span className="readout"> 1 ns = 1 second</span> — suddenly the network feels as far away as it really is.
      </p>
    </div>
  );
}
