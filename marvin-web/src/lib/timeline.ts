export const clamp = (value: number) =>
  Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
const segment = (p: number, start: number, end: number) =>
  clamp((p - start) / (end - start));
export function fallbackProgress(elapsed: number) {
  const time = Number.isFinite(elapsed) ? Math.max(0, elapsed) : 0;
  if (time < 120) return 0.78 + 0.08 * time / 120;
  if (time < 200) return 0.88;
  return 0.9 + 0.1 * clamp((time - 200) / 180);
}
export function timeline(progress: number, duration = 0) {
  const p = clamp(progress);
  const lastUsableTime = Number.isFinite(duration)
    ? Math.max(0, duration - 0.05)
    : 0;
  return {
    progress: p,
    phase:
      p < 0.08
        ? "poster"
        : p < 0.78
          ? "entrance"
          : p < 0.86
            ? "fade"
            : p < 0.9
              ? "white"
              : "monitor",
    time: segment(p, 0.08, 0.78) * lastUsableTime,
    white: segment(p, 0.78, 0.86),
    monitor: segment(p, 0.9, 1),
    interactive: p >= 1,
  };
}
export const wrap = (index: number, length: number) =>
  ((index % length) + length) % length;
