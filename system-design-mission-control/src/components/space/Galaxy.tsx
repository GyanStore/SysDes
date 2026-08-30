import { useMemo } from "react";

/**
 * A procedural spiral galaxy drawn as SVG (no external images).
 * Deterministic — same color always yields the same galaxy.
 */
export default function Galaxy({
  color = "#5eb0ff",
  size = 72,
  className = "",
  spin = true,
  dim = false,
}: {
  color?: string;
  size?: number;
  className?: string;
  spin?: boolean;
  dim?: boolean;
}) {
  const stars = useMemo(() => {
    const pts: { x: number; y: number; r: number; o: number; c: string }[] = [];
    const arms = 2;
    const perArm = 22;
    const turns = 1.6;
    for (let a = 0; a < arms; a++) {
      for (let i = 0; i < perArm; i++) {
        const t = i / perArm;
        const angle = a * Math.PI + t * turns * 2 * Math.PI;
        const r = 6 + t * 40;
        // slight jitter via trig so arms look natural but stay deterministic
        const jitter = Math.sin(i * 12.9898 + a * 4.1414) * 2.2;
        const x = 50 + (r + jitter) * Math.cos(angle);
        const y = 50 + (r + jitter) * Math.sin(angle);
        pts.push({
          x,
          y,
          r: 1.6 * (1 - t * 0.55),
          o: 0.9 - t * 0.6,
          c: i % 4 === 0 ? "#ffffff" : color,
        });
      }
    }
    // a few scattered halo stars
    for (let i = 0; i < 10; i++) {
      const angle = i * 2.4;
      const r = 20 + ((i * 37) % 28);
      pts.push({
        x: 50 + r * Math.cos(angle),
        y: 50 + r * Math.sin(angle),
        r: 0.7,
        o: 0.5,
        c: "#cfe0ff",
      });
    }
    return pts;
  }, [color]);

  const gid = useMemo(() => `g${Math.random().toString(36).slice(2, 8)}`, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${spin ? "gx-spin" : ""} ${className}`}
      style={{ opacity: dim ? 0.5 : 1, overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${gid}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="35%" stopColor={color} stopOpacity="0.85" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${gid}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="70%" stopColor={color} stopOpacity="0.06" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* soft outer halo */}
      <circle cx="50" cy="50" r="50" fill={`url(#${gid}-halo)`} />
      {/* spiral arm stars */}
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity={s.o} />
      ))}
      {/* bright core */}
      <circle cx="50" cy="50" r="14" fill={`url(#${gid}-core)`} />
      <circle cx="50" cy="50" r="3" fill="#ffffff" opacity="0.95" />
    </svg>
  );
}
