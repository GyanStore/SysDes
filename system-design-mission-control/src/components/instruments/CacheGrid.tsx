import { useRef, useState } from "react";
import { useTicker } from "@/lib/useTicker";
import { StatTile, PlayControls } from "@/components/ui/atoms";

type Policy = "LRU" | "LFU" | "FIFO";
interface Slot {
  key: string;
  freq: number;
  inserted: number;
  used: number;
}

const SIZE = 6;
// Skewed key universe: a few hot keys dominate (Zipf-like).
const KEYS = ["A", "A", "A", "B", "B", "C", "D", "E", "F", "G", "H", "I"];

export default function CacheGrid({ accent = "#5eb0ff" }: { accent?: string }) {
  const [policy, setPolicy] = useState<Policy>("LRU");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [flash, setFlash] = useState<{ key: string; hit: boolean } | null>(null);
  const clock = useRef(0);
  const hits = useRef(0);
  const total = useRef(0);
  const acc = useRef(0);
  const [, force] = useState(0);

  function access(key: string, cur: Slot[]): Slot[] {
    clock.current += 1;
    total.current += 1;
    const idx = cur.findIndex((s) => s.key === key);
    if (idx >= 0) {
      hits.current += 1;
      setFlash({ key, hit: true });
      const copy = cur.slice();
      copy[idx] = { ...copy[idx], freq: copy[idx].freq + 1, used: clock.current };
      return copy;
    }
    setFlash({ key, hit: false });
    const entry: Slot = { key, freq: 1, inserted: clock.current, used: clock.current };
    if (cur.length < SIZE) return [...cur, entry];
    // evict per policy
    let victim = 0;
    for (let i = 1; i < cur.length; i++) {
      if (policy === "LRU" && cur[i].used < cur[victim].used) victim = i;
      if (policy === "LFU" && cur[i].freq < cur[victim].freq) victim = i;
      if (policy === "FIFO" && cur[i].inserted < cur[victim].inserted) victim = i;
    }
    const copy = cur.slice();
    copy[victim] = entry;
    return copy;
  }

  const doOne = () => {
    const key = KEYS[Math.floor(Math.random() * KEYS.length)];
    setSlots((s) => access(key, s));
    force((t) => (t + 1) % 100000);
  };

  const { playing, toggle } = useTicker((dt) => {
    acc.current += dt;
    if (acc.current >= 0.45) {
      acc.current = 0;
      doOne();
    }
  });

  const ratio = total.current ? (hits.current / total.current) * 100 : 0;

  return (
    <div>
      <div className="panel p-4">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {Array.from({ length: SIZE }).map((_, i) => {
            const s = slots[i];
            const isFlash = s && flash?.key === s.key;
            return (
              <div
                key={i}
                className="panel aspect-square grid place-items-center relative"
                style={{
                  borderColor: isFlash ? (flash?.hit ? "#57e389" : "#ff6b8b") : undefined,
                  boxShadow: isFlash ? `0 0 0 1px ${flash?.hit ? "#57e389" : "#ff6b8b"}` : undefined,
                }}
              >
                {s ? (
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: accent }}>{s.key}</div>
                    <div className="text-[9px] text-muted readout">f{s.freq}</div>
                  </div>
                ) : (
                  <div className="text-muted text-xs">empty</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {(["LRU", "LFU", "FIFO"] as Policy[]).map((p) => (
          <button
            key={p}
            className={`btn ${policy === p ? "btn-primary" : ""}`}
            onClick={() => setPolicy(p)}
          >
            {p}
          </button>
        ))}
        <PlayControls
          playing={playing}
          onToggle={toggle}
          onStep={() => doOne()}
          onReset={() => {
            setSlots([]);
            hits.current = 0;
            total.current = 0;
            clock.current = 0;
            setFlash(null);
            force((t) => t + 1);
          }}
        />
      </div>

      <div className="mt-3 flex gap-2 flex-wrap">
        <StatTile label="Policy" value={policy} />
        <StatTile label="Requests" value={String(total.current)} />
        <StatTile label="Hit ratio" value={`${ratio.toFixed(0)}%`} tone="#6bf0c8" />
      </div>
      <p className="text-muted text-xs mt-3">
        Requests are skewed — <span className="readout">A/B</span> are hot. Watch which policy keeps the hot keys
        resident and drives the hit ratio up. Step manually to see each eviction decision.
      </p>
    </div>
  );
}
