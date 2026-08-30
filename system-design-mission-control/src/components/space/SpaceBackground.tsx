import { useMemo } from "react";
import Galaxy from "./Galaxy";

/** Build a `box-shadow` string of N stars scattered in an area. */
function starField(count: number, area: number, maxSize: number): { shadow: string; dot: number } {
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.round(Math.random() * area);
    const y = Math.round(Math.random() * area);
    const bright = Math.random();
    const c =
      bright > 0.92 ? "#bcd4ff" : bright > 0.8 ? "#e8f0ff" : "#ffffff";
    parts.push(`${x}px ${y}px ${c}`);
  }
  return { shadow: parts.join(","), dot: Math.max(1, Math.round(maxSize)) };
}

export default function SpaceBackground() {
  const near = useMemo(() => starField(90, 2000, 2), []);
  const mid = useMemo(() => starField(140, 2000, 1.4), []);
  const far = useMemo(() => starField(220, 2000, 1), []);

  // A handful of individually-twinkling bright stars.
  const twinkles = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        top: `${Math.round(Math.random() * 100)}%`,
        left: `${Math.round(Math.random() * 100)}%`,
        delay: `${(Math.random() * 6).toFixed(2)}s`,
        dur: `${(2.5 + Math.random() * 3).toFixed(2)}s`,
        size: Math.random() > 0.7 ? 2.5 : 1.6,
      })),
    [],
  );

  return (
    <div className="space-bg" aria-hidden="true">
      {/* deep-space base + nebulae */}
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      <div className="nebula nebula-3" />

      {/* parallax star layers (box-shadow fields) */}
      <div className="stars-wrap">
        <div className="stars stars-far" style={{ width: far.dot, height: far.dot, boxShadow: far.shadow }} />
        <div className="stars stars-mid" style={{ width: mid.dot, height: mid.dot, boxShadow: mid.shadow }} />
        <div className="stars stars-near" style={{ width: near.dot, height: near.dot, boxShadow: near.shadow }} />
      </div>

      {/* twinkling accents */}
      {twinkles.map((t, i) => (
        <span
          key={i}
          className="twinkle"
          style={{
            top: t.top,
            left: t.left,
            width: t.size,
            height: t.size,
            animationDelay: t.delay,
            animationDuration: t.dur,
          }}
        />
      ))}

      {/* distant drifting galaxies */}
      <div className="drift-galaxy" style={{ top: "8%", right: "6%" }}>
        <Galaxy color="#b79bff" size={190} dim />
      </div>
      <div className="drift-galaxy drift-galaxy--slow" style={{ bottom: "6%", left: "4%" }}>
        <Galaxy color="#5eead4" size={150} dim />
      </div>

      {/* occasional shooting stars */}
      <span className="shooting-star ss-1" />
      <span className="shooting-star ss-2" />
    </div>
  );
}
