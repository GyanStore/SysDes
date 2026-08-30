import { useMemo, useRef, useState } from "react";
import { useTicker } from "@/lib/useTicker";
import { PlayControls } from "@/components/ui/atoms";

interface Node {
  id: string;
  label: string;
  x: number; // 0..100
  y: number; // 0..100
  kind?: string;
}
interface Edge {
  from: string;
  to: string;
}
interface Config {
  nodes?: Node[];
  edges?: Edge[];
  caption?: string;
}

const KIND_COLOR: Record<string, string> = {
  client: "#9cc7ff",
  net: "#5eb0ff",
  app: "#6bf0c8",
  cache: "#ffcf6e",
  db: "#b79bff",
};

const DEFAULT: Required<Pick<Config, "nodes" | "edges">> = {
  nodes: [
    { id: "u", label: "Client", x: 10, y: 50, kind: "client" },
    { id: "s", label: "Server", x: 50, y: 50, kind: "app" },
    { id: "d", label: "Database", x: 90, y: 50, kind: "db" },
  ],
  edges: [
    { from: "u", to: "s" },
    { from: "s", to: "d" },
  ],
};

export default function FlowStage({ config, accent = "#5eb0ff" }: { config?: Config; accent?: string }) {
  const nodes = config?.nodes?.length ? config.nodes : DEFAULT.nodes;
  const edges = config?.edges?.length ? config.edges : DEFAULT.edges;
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  const progress = useRef(0);
  const [tick, setTick] = useState(0);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const { playing, toggle, step } = useTicker((dt) => {
    progress.current = (progress.current + dt * 0.7) % edges.length;
    setTick((t) => (t + 1) % 100000);
  });

  // position of the travelling packet
  const seg = Math.floor(progress.current) % edges.length;
  const frac = progress.current - Math.floor(progress.current);
  const edge = edges[seg];
  const a = edge && byId[edge.from];
  const b = edge && byId[edge.to];
  const py = (y: number) => 6 + y * 0.52; // map 0..100 -> ~6..58
  const pos = a && b ? { x: a.x + (b.x - a.x) * frac, y: py(a.y) + (py(b.y) - py(a.y)) * frac } : null;

  // light up the node the packet just reached
  const reachedNode = b?.id;
  if (frac > 0.9 && reachedNode && reachedNode !== activeNode) setActiveNode(reachedNode);
  if (frac < 0.1 && a?.id && a.id !== activeNode) setActiveNode(a.id);

  return (
    <div>
      <div className="panel p-3">
        <svg viewBox="0 0 100 64" className="w-full" style={{ aspectRatio: "100 / 64" }} role="img" aria-label={config?.caption ?? "architecture flow diagram"}>
          {/* edges */}
          {edges.map((e, i) => {
            const s = byId[e.from];
            const t = byId[e.to];
            if (!s || !t) return null;
            return (
              <line
                key={i}
                x1={s.x}
                y1={py(s.y)}
                x2={t.x}
                y2={py(t.y)}
                stroke="#2a3a66"
                strokeWidth={0.6}
                strokeDasharray="1.6 1.6"
              />
            );
          })}
          {/* packet */}
          {pos && (
            <circle cx={pos.x} cy={pos.y} r={1.7} fill={accent} key={`${tick}-p`}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur="0.8s" repeatCount="indefinite" />
            </circle>
          )}
          {pos && <circle cx={pos.x} cy={pos.y} r={3.4} fill={accent} opacity={0.18} />}
          {/* nodes */}
          {nodes.map((n) => {
            const c = KIND_COLOR[n.kind ?? "app"] ?? accent;
            const on = activeNode === n.id;
            return (
              <g key={n.id}>
                <rect
                  x={n.x - 9}
                  y={py(n.y) - 4}
                  width={18}
                  height={8}
                  rx={2}
                  fill={on ? "#141f3d" : "#0e1730"}
                  stroke={c}
                  strokeWidth={on ? 0.9 : 0.5}
                  opacity={on ? 1 : 0.85}
                />
                <circle cx={n.x - 6} cy={py(n.y)} r={1.1} fill={c} />
                <text x={n.x + 0.5} y={py(n.y) + 1.4} textAnchor="middle" fontSize={2.6} fill="#e9eeff" fontFamily="var(--sans)">
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
        <PlayControls playing={playing} onToggle={toggle} onStep={step} />
        {config?.caption && <p className="text-muted text-xs">{config.caption}</p>}
      </div>
    </div>
  );
}
