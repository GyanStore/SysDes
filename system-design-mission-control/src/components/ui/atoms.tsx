import type { ReactNode } from "react";

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`panel ${className}`}>{children}</div>;
}

export function Chip({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span className="chip" style={color ? { color, borderColor: color } : undefined}>
      {children}
    </span>
  );
}

export function PlayControls({
  playing,
  onToggle,
  onStep,
  onReset,
}: {
  playing: boolean;
  onToggle: () => void;
  onStep: () => void;
  onReset?: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button className="btn" onClick={onToggle} aria-label={playing ? "Pause" : "Play"}>
        {playing ? "⏸ Pause" : "▶ Play"}
      </button>
      <button className="btn" onClick={onStep} aria-label="Step forward">
        ⏭ Step
      </button>
      {onReset && (
        <button className="btn" onClick={onReset} aria-label="Reset">
          ↺ Reset
        </button>
      )}
    </div>
  );
}

export function Labeled({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wider text-muted">
        {label} {value != null && <span className="readout">{value}</span>}
      </span>
      {children}
    </label>
  );
}

export function StatTile({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="panel px-3 py-2 min-w-[92px]">
      <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>
      <div className="readout text-lg" style={tone ? { color: tone } : undefined}>
        {value}
      </div>
    </div>
  );
}
