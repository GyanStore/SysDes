import { useRef, useState } from "react";
import { useTicker } from "@/lib/useTicker";
import { PlayControls } from "@/components/ui/atoms";

interface Event {
  t: number;
  from: number; // actor index
  to: number;
  label: string;
}
interface Config {
  actors?: string[];
  events?: Event[];
  caption?: string;
}

const DEFAULT: Required<Pick<Config, "actors" | "events">> = {
  actors: ["Client", "Server"],
  events: [
    { t: 0, from: 0, to: 1, label: "request" },
    { t: 1, from: 1, to: 0, label: "response" },
  ],
};

export default function Timeline({ config, accent = "#5eb0ff" }: { config?: Config; accent?: string }) {
  const actors = config?.actors?.length ? config.actors : DEFAULT.actors;
  const events = config?.events?.length ? config.events : DEFAULT.events;
  const maxT = Math.max(...events.map((e) => e.t)) + 1;

  const head = useRef(0);
  const [, force] = useState(0);
  const { playing, toggle, step } = useTicker((dt) => {
    head.current = (head.current + dt * 0.8) % (maxT + 0.8);
    force((t) => (t + 1) % 100000);
  });

  const W = 100;
  const H = 12 + actors.length * 16;
  const laneY = (i: number) => 12 + i * 16;
  const tx = (t: number) => 22 + (t / maxT) * (W - 30);

  return (
    <div>
      <div className="panel p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ aspectRatio: `${W} / ${H}` }} role="img" aria-label={config?.caption ?? "timeline diagram"}>
          {/* actor lanes */}
          {actors.map((a, i) => (
            <g key={i}>
              <text x={2} y={laneY(i) + 1.2} fontSize={3} fill="#8fa0cc" fontFamily="var(--sans)">{a}</text>
              <line x1={20} y1={laneY(i)} x2={W - 4} y2={laneY(i)} stroke="#22315c" strokeWidth={0.4} />
            </g>
          ))}
          {/* playhead */}
          <line x1={tx(head.current)} y1={6} x2={tx(head.current)} y2={H - 4} stroke={accent} strokeWidth={0.4} opacity={0.6} />
          {/* events */}
          {events.map((e, i) => {
            const passed = head.current >= e.t;
            const x = tx(e.t);
            const y1 = laneY(e.from);
            const y2 = laneY(e.to);
            const col = passed ? accent : "#33436e";
            if (e.from === e.to) {
              return (
                <g key={i} opacity={passed ? 1 : 0.4}>
                  <circle cx={x} cy={y1} r={1.4} fill={col} />
                  <text x={x + 2} y={y1 - 1.5} fontSize={2.6} fill={passed ? "#e9eeff" : "#5a6a94"}>{e.label}</text>
                </g>
              );
            }
            const midY = (y1 + y2) / 2;
            return (
              <g key={i} opacity={passed ? 1 : 0.4}>
                <line x1={x} y1={y1} x2={x} y2={y2} stroke={col} strokeWidth={0.6} markerEnd="url(#arrow)" />
                <circle cx={x} cy={y1} r={1.1} fill={col} />
                <text x={x + 2} y={midY} fontSize={2.6} fill={passed ? "#e9eeff" : "#5a6a94"}>{e.label}</text>
              </g>
            );
          })}
          <defs>
            <marker id="arrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
              <path d="M0,0 L4,2 L0,4 Z" fill={accent} />
            </marker>
          </defs>
        </svg>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
        <PlayControls playing={playing} onToggle={toggle} onStep={step} onReset={() => { head.current = 0; force((t) => t + 1); }} />
        {config?.caption && <p className="text-muted text-xs">{config.caption}</p>}
      </div>
    </div>
  );
}
