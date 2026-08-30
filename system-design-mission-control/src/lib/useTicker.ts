import { useEffect, useRef, useState } from "react";

/** True if the user asked for reduced motion. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/**
 * A play/pause animation loop. Calls `onTick(dtSeconds)` each frame while playing.
 * Returns controls. Reduced-motion users can still step manually.
 */
export function useTicker(onTick: (dt: number) => void, autoplay = true) {
  const [playing, setPlaying] = useState(autoplay);
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);
  const cb = useRef(onTick);
  cb.current = onTick;

  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last.current) / 1000);
      last.current = t;
      cb.current(dt);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing]);

  return {
    playing,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    toggle: () => setPlaying((p) => !p),
    step: () => cb.current(0.5),
  };
}
