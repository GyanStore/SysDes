import { useMemo, useRef, useState } from "react";
import { StatTile } from "@/components/ui/atoms";

/** Deterministic string hash → [0, 360). */
function hashAngle(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 3600) / 10;
}

const PALETTE = ["#5eb0ff", "#6bf0c8", "#ffcf6e", "#b79bff", "#ff6b8b", "#57e389", "#ff9ec4", "#9cc7ff"];
const R = 38;
const CX = 50;
const CY = 50;

function polar(angleDeg: number, radius = R) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
}

interface PhysNode {
  name: string;
  color: string;
}

export default function NodeRing() {
  const [nodes, setNodes] = useState<PhysNode[]>([
    { name: "node-A", color: PALETTE[0] },
    { name: "node-B", color: PALETTE[1] },
    { name: "node-C", color: PALETTE[2] },
  ]);
  const [keys, setKeys] = useState<string[]>(() =>
    Array.from({ length: 12 }, (_, i) => `key-${i + 1}`),
  );
  const [vnodes, setVnodes] = useState(1);
  const [moved, setMoved] = useState<number | null>(null);
  const [modNMoved, setModNMoved] = useState<number | null>(null);
  const nextId = useRef(nodes.length);

  // build the ring: every vnode of every physical node
  const ring = useMemo(() => {
    const pts: { angle: number; node: PhysNode }[] = [];
    for (const n of nodes) {
      for (let v = 0; v < vnodes; v++) {
        pts.push({ angle: hashAngle(`${n.name}#${v}`), node: n });
      }
    }
    return pts.sort((a, b) => a.angle - b.angle);
  }, [nodes, vnodes]);

  function ownerOf(angle: number, ringPts = ring): PhysNode | null {
    if (ringPts.length === 0) return null;
    for (const p of ringPts) if (p.angle >= angle) return p.node;
    return ringPts[0].node; // wrap around the top
  }

  const keyData = useMemo(
    () => keys.map((k) => ({ key: k, angle: hashAngle(k), owner: ownerOf(hashAngle(k)) })),
    [keys, ring],
  );

  function ownershipMap(ringPts: { angle: number; node: PhysNode }[]) {
    const m = new Map<string, string>();
    for (const k of keys) m.set(k, ownerOf(hashAngle(k), ringPts)?.name ?? "");
    return m;
  }

  function withMoveTracking(mutate: () => PhysNode[]) {
    const before = ownershipMap(ring);
    const newNodes = mutate();
    // recompute ring for new nodes
    const pts: { angle: number; node: PhysNode }[] = [];
    for (const n of newNodes) for (let v = 0; v < vnodes; v++) pts.push({ angle: hashAngle(`${n.name}#${v}`), node: n });
    pts.sort((a, b) => a.angle - b.angle);
    const after = ownershipMap(pts);
    let m = 0;
    for (const k of keys) if (before.get(k) !== after.get(k)) m++;
    setMoved(m);
    // mod-N comparison: how many keys change bucket when N changes by 1
    const oldN = nodes.length;
    const newN = newNodes.length;
    if (oldN > 0 && newN > 0) {
      let mm = 0;
      for (const k of keys) {
        const h = Math.round(hashAngle(k) * 10);
        if (h % oldN !== h % newN) mm++;
      }
      setModNMoved(mm);
    }
    setNodes(newNodes);
  }

  const addNode = () =>
    withMoveTracking(() => {
      const id = nextId.current++;
      const letter = String.fromCharCode(65 + (nodes.length % 26));
      return [...nodes, { name: `node-${letter}${id}`, color: PALETTE[nodes.length % PALETTE.length] }];
    });

  const removeNode = () =>
    withMoveTracking(() => (nodes.length > 1 ? nodes.slice(0, -1) : nodes));

  const addKeys = () => {
    setMoved(null);
    setModNMoved(null);
    setKeys((ks) => [...ks, ...Array.from({ length: 6 }, (_, i) => `key-${ks.length + i + 1}`)]);
  };

  return (
    <div>
      <div className="panel p-3">
        <svg viewBox="0 0 100 100" className="w-full max-w-[440px] mx-auto block" role="img" aria-label="consistent hashing ring">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#22315c" strokeWidth={0.8} />
          {/* clock hint */}
          <text x={CX} y={7.5} textAnchor="middle" fontSize={3} fill="#8fa0cc">0°</text>
          {/* key → owner arcs */}
          {keyData.map((k, i) => {
            const p = polar(k.angle, R);
            const color = k.owner?.color ?? "#8fa0cc";
            return (
              <g key={`k${i}`}>
                <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={color} strokeWidth={0.25} opacity={0.35} />
                <circle cx={p.x} cy={p.y} r={1.3} fill={color} />
              </g>
            );
          })}
          {/* node markers */}
          {ring.map((p, i) => {
            const pt = polar(p.angle, R);
            const outer = polar(p.angle, R + 4);
            return (
              <g key={`n${i}`}>
                <line x1={pt.x} y1={pt.y} x2={outer.x} y2={outer.y} stroke={p.node.color} strokeWidth={0.8} />
                <rect x={pt.x - 2.2} y={pt.y - 2.2} width={4.4} height={4.4} rx={1} fill={p.node.color} />
              </g>
            );
          })}
          <circle cx={CX} cy={CY} r={1} fill="#8fa0cc" />
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button className="btn btn-primary" onClick={addNode}>+ Add node</button>
        <button className="btn" onClick={removeNode}>− Remove node</button>
        <button className="btn" onClick={addKeys}>+ Add keys</button>
        <button
          className={`btn ${vnodes > 1 ? "btn-primary" : ""}`}
          onClick={() => {
            setMoved(null);
            setModNMoved(null);
            setVnodes((v) => (v === 1 ? 8 : 1));
          }}
        >
          Virtual nodes: {vnodes === 1 ? "off" : "×8"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <StatTile label="Physical nodes" value={String(nodes.length)} />
        <StatTile label="Keys" value={String(keys.length)} />
        <StatTile label="Ring points" value={String(ring.length)} />
        {moved != null && (
          <StatTile label="Keys moved (ring)" value={String(moved)} tone="#6bf0c8" />
        )}
        {modNMoved != null && (
          <StatTile label="Would move (mod-N)" value={String(modNMoved)} tone="#ff6b8b" />
        )}
      </div>

      <p className="text-muted text-xs mt-3">
        Add or remove a node and compare <span className="readout" style={{ color: "#6bf0c8" }}>keys moved on the ring</span>{" "}
        vs how many <span className="readout" style={{ color: "#ff6b8b" }}>hash-mod-N</span> would have reshuffled.
        Turn on virtual nodes to see the load even out.
      </p>
    </div>
  );
}
