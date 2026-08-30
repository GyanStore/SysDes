import { useMemo, useState } from "react";
import { StatTile } from "@/components/ui/atoms";

const M = 24; // bits
const K = 3; // hash functions

// K independent-ish deterministic hashes → [0, M)
function hashes(s: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < K; i++) {
    let h = 2166136261 ^ (i * 0x9e3779b1);
    for (let c = 0; c < s.length; c++) {
      h ^= s.charCodeAt(c);
      h = Math.imul(h, 16777619);
    }
    out.push((h >>> 0) % M);
  }
  return out;
}

const ADD_WORDS = ["alice", "bob", "carol", "dave"];
const TEST_WORDS = ["alice", "eve", "bob", "mallory", "trent"];

export default function BloomFilter({ accent = "#5eb0ff" }: { accent?: string }) {
  const [bits, setBits] = useState<boolean[]>(() => Array(M).fill(false));
  const [added, setAdded] = useState<string[]>([]);
  const [active, setActive] = useState<number[]>([]);
  const [result, setResult] = useState<{ word: string; present: boolean; falsePos: boolean } | null>(null);

  const fill = bits.filter(Boolean).length;
  const n = added.length;
  // theoretical false-positive rate (1 - e^(-kn/m))^k
  const fpRate = useMemo(() => (n === 0 ? 0 : Math.pow(1 - Math.exp((-K * n) / M), K)), [n]);

  function add(word: string) {
    if (added.includes(word)) return;
    const idx = hashes(word);
    setBits((b) => {
      const nb = b.slice();
      idx.forEach((i) => (nb[i] = true));
      return nb;
    });
    setAdded((a) => [...a, word]);
    setActive(idx);
    setResult(null);
  }

  function query(word: string) {
    const idx = hashes(word);
    const allSet = idx.every((i) => bits[i]);
    setActive(idx);
    setResult({ word, present: allSet, falsePos: allSet && !added.includes(word) });
  }

  function reset() {
    setBits(Array(M).fill(false));
    setAdded([]);
    setActive([]);
    setResult(null);
  }

  return (
    <div>
      <div className="panel p-4">
        {/* bit array */}
        <div className="grid grid-cols-12 gap-1.5">
          {bits.map((on, i) => {
            const isActive = active.includes(i);
            return (
              <div
                key={i}
                className="aspect-square rounded grid place-items-center text-[10px] readout border transition-colors"
                style={{
                  background: on ? (isActive ? accent : "#12224a") : "#0a1130",
                  borderColor: isActive ? "#6bf0c8" : on ? accent : "var(--line)",
                  color: on ? "#e9eeff" : "#43518a",
                }}
                title={`bit ${i}`}
              >
                {on ? 1 : 0}
              </div>
            );
          })}
        </div>

        {result && (
          <div
            className="mt-4 panel p-3"
            style={{ borderColor: result.present ? (result.falsePos ? "#ffcf6e" : "#57e389") : "#ff6b8b" }}
          >
            <span className="readout" style={{ color: accent }}>“{result.word}”</span>{" "}
            {result.present ? (
              result.falsePos ? (
                <span style={{ color: "#ffcf6e" }}>→ “maybe present” — but it was never added. This is a false positive!</span>
              ) : (
                <span style={{ color: "#57e389" }}>→ “maybe present” (and it really was added)</span>
              )
            ) : (
              <span style={{ color: "#ff6b8b" }}>→ definitely NOT present (at least one bit is 0)</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Add to filter</div>
        <div className="flex flex-wrap gap-2">
          {ADD_WORDS.map((w) => (
            <button key={w} className="btn" onClick={() => add(w)} disabled={added.includes(w)}>
              + {w}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Query membership</div>
        <div className="flex flex-wrap gap-2">
          {TEST_WORDS.map((w) => (
            <button key={w} className="btn" onClick={() => query(w)}>
              ? {w}
            </button>
          ))}
          <button className="btn" onClick={reset}>↺ Reset</button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <StatTile label="Bits set" value={`${fill}/${M}`} />
        <StatTile label="Items added" value={String(n)} tone={accent} />
        <StatTile label="Est. false-positive" value={`${(fpRate * 100).toFixed(0)}%`} tone="#ffcf6e" />
      </div>
      <p className="text-muted text-xs mt-3">
        Each item flips <span className="readout">k=3</span> bits. A query is “maybe present” only if all its
        bits are 1 — so a miss is <span className="readout" style={{ color: "#ff6b8b" }}>always right</span>, but a hit can be a
        <span className="readout" style={{ color: "#ffcf6e" }}> false positive</span>. Add more items and watch the FP rate climb.
      </p>
    </div>
  );
}
