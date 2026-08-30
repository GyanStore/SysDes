import { useRef, useState } from "react";
import { useTicker } from "@/lib/useTicker";
import { StatTile, Labeled, PlayControls } from "@/components/ui/atoms";

type Mode = "ratelimit" | "balance" | "scaling" | "backpressure";

function Bar({ pct, color, label }: { pct: number; color: string; label?: string }) {
  return (
    <div className="w-full">
      {label && <div className="text-[10px] text-muted mb-1">{label}</div>}
      <div className="h-3 rounded-full bg-[#0a1130] border border-line overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-150"
          style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function LoadDial({ config, accent = "#5eb0ff" }: { config?: { mode?: Mode }; accent?: string }) {
  const mode: Mode = config?.mode ?? "ratelimit";
  const [rate, setRate] = useState(mode === "backpressure" ? 60 : 300); // req/s
  const [servers, setServers] = useState(3);
  const [vertical, setVertical] = useState(false);
  const [backpressure, setBackpressure] = useState(false);

  // time-integrated state
  const tokens = useRef(50);
  const queue = useRef(0);
  const allowedEma = useRef(0);
  const droppedEma = useRef(0);
  const [, force] = useState(0);

  const CAP_PER_SERVER = 120; // req/s
  const BUCKET = 100; // tokens
  const LIMIT = 200; // refill/s (rate limit)
  const CONSUMER = 80; // req/s for backpressure
  const QUEUE_MAX = 200;

  const { playing, toggle, step } = useTicker((dt) => {
    if (mode === "ratelimit") {
      tokens.current = Math.min(BUCKET, tokens.current + LIMIT * dt);
      const incoming = rate * dt;
      const allowed = Math.min(incoming, tokens.current);
      tokens.current -= allowed;
      const dropped = incoming - allowed;
      allowedEma.current = allowedEma.current * 0.9 + (allowed / Math.max(dt, 0.0001)) * 0.1;
      droppedEma.current = droppedEma.current * 0.9 + (dropped / Math.max(dt, 0.0001)) * 0.1;
    } else if (mode === "backpressure") {
      const effProducer = backpressure ? Math.min(rate, CONSUMER) : rate;
      queue.current = Math.max(0, queue.current + (effProducer - CONSUMER) * dt);
    }
    force((t) => (t + 1) % 100000);
  });

  const overloaded = queue.current >= QUEUE_MAX;

  return (
    <div>
      <div className="panel p-4">
        <Labeled label="Incoming traffic" value={`${rate} req/s`}>
          <input
            type="range"
            min={0}
            max={mode === "backpressure" ? 200 : 800}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: accent }}
          />
        </Labeled>

        {/* ---- RATE LIMIT ---- */}
        {mode === "ratelimit" && (
          <div className="mt-4 space-y-3">
            <Bar pct={(tokens.current / BUCKET) * 100} color="#6bf0c8" label={`Token bucket (${tokens.current.toFixed(0)}/${BUCKET})`} />
            <div className="flex gap-2 flex-wrap">
              <StatTile label="Allowed" value={`${allowedEma.current.toFixed(0)}/s`} tone="#57e389" />
              <StatTile label="Dropped (429)" value={`${Math.max(0, droppedEma.current).toFixed(0)}/s`} tone="#ff6b8b" />
              <StatTile label="Limit" value={`${LIMIT}/s`} />
            </div>
            <p className="text-muted text-xs">
              Below the limit, tokens refill and everything passes. Push traffic past{" "}
              <span className="readout">{LIMIT}/s</span> and the bucket drains — excess gets a 429.
            </p>
          </div>
        )}

        {/* ---- LOAD BALANCE ---- */}
        {mode === "balance" && (
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <button className="btn" onClick={() => setServers((s) => Math.min(8, s + 1))}>+ server</button>
              <button className="btn" onClick={() => setServers((s) => Math.max(1, s - 1))}>− server</button>
            </div>
            {Array.from({ length: servers }).map((_, i) => {
              const perServer = rate / servers;
              const pct = (perServer / CAP_PER_SERVER) * 100;
              return <Bar key={i} pct={pct} color={pct > 100 ? "#ff6b8b" : accent} label={`server ${i + 1} — ${perServer.toFixed(0)}/${CAP_PER_SERVER} req/s`} />;
            })}
            <div className="flex gap-2 flex-wrap">
              <StatTile label="Capacity" value={`${servers * CAP_PER_SERVER}/s`} />
              <StatTile label="Dropped" value={`${Math.max(0, rate - servers * CAP_PER_SERVER).toFixed(0)}/s`} tone="#ff6b8b" />
            </div>
            <p className="text-muted text-xs">Round-robin spreads {rate} req/s across {servers} servers. Add servers to clear the red overload.</p>
          </div>
        )}

        {/* ---- SCALING ---- */}
        {mode === "scaling" && (
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <button className={`btn ${!vertical ? "btn-primary" : ""}`} onClick={() => setVertical(false)}>Scale out (horizontal)</button>
              <button className={`btn ${vertical ? "btn-primary" : ""}`} onClick={() => setVertical(true)}>Scale up (vertical)</button>
            </div>
            {vertical ? (
              <>
                <Bar pct={(rate / 250) * 100} color={rate > 250 ? "#ff6b8b" : accent} label={`one big box — ceiling 250 req/s`} />
                {rate > 250 && <p className="text-danger text-xs">⚠ Hit the hardware ceiling — you can't buy a bigger box fast enough.</p>}
              </>
            ) : (
              <>
                {Array.from({ length: Math.max(1, Math.ceil(rate / CAP_PER_SERVER)) }).map((_, i) => (
                  <Bar key={i} pct={80} color={accent} label={`box ${i + 1}`} />
                ))}
                <p className="text-muted text-xs">Add commodity boxes as load grows — no ceiling, but you must be stateless.</p>
              </>
            )}
          </div>
        )}

        {/* ---- BACKPRESSURE ---- */}
        {mode === "backpressure" && (
          <div className="mt-4 space-y-3">
            <button className={`btn ${backpressure ? "btn-primary" : ""}`} onClick={() => setBackpressure((b) => !b)}>
              Backpressure: {backpressure ? "on" : "off"}
            </button>
            <Bar pct={(queue.current / QUEUE_MAX) * 100} color={overloaded ? "#ff6b8b" : queue.current > QUEUE_MAX * 0.6 ? "#ffcf6e" : "#6bf0c8"} label={`queue depth ${queue.current.toFixed(0)}/${QUEUE_MAX}`} />
            <div className="flex gap-2 flex-wrap">
              <StatTile label="Producer" value={`${(backpressure ? Math.min(rate, CONSUMER) : rate)}/s`} />
              <StatTile label="Consumer" value={`${CONSUMER}/s`} />
              <StatTile label="Status" value={overloaded ? "OVERFLOW" : "stable"} tone={overloaded ? "#ff6b8b" : "#57e389"} />
            </div>
            <p className="text-muted text-xs">
              With backpressure off, a producer faster than {CONSUMER}/s fills the queue until it overflows.
              Turn it on to cap the producer to what the consumer can handle.
            </p>
          </div>
        )}
      </div>

      {(mode === "ratelimit" || mode === "backpressure") && (
        <div className="mt-3">
          <PlayControls
            playing={playing}
            onToggle={toggle}
            onStep={step}
            onReset={() => {
              tokens.current = 50;
              queue.current = 0;
              allowedEma.current = 0;
              droppedEma.current = 0;
              force((t) => t + 1);
            }}
          />
        </div>
      )}
    </div>
  );
}
