export const clamp = (value: number) => Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
const segment = (p: number, start: number, end: number) => clamp((p - start) / (end - start));
const ease = (t: number) => t * t * (3 - 2 * t);

// Pure, reversible rail/camera poses. Secondary fabric movement settles around
// these targets without advancing the scroll timeline or moving the camera.
export function timeline(progress: number) {
  const p = clamp(progress);
  return {
    progress: p,
    phase: p < .08 ? "booth" : p < .36 ? "opening" : p < .43 ? "open"
      : p < .78 ? "entering" : p < .86 ? "fade" : p < .9 ? "white" : "monitor",
    curtain: ease(segment(p, .08, .36)),
    alignment: ease(segment(p, .43, .58)),
    travel: ease(segment(p, .48, .78)),
    white: segment(p, .78, .86),
    monitor: segment(p, .9, 1),
    interactive: p >= 1,
  };
}
export const wrap = (index: number, length: number) => ((index % length) + length) % length;

export function cameraPose(progress: number, distance: number) {
  const pose = timeline(progress);
  return {
    x: .94 + .36 * (1 - pose.alignment),
    y: 1.7 + .3 * (1 - pose.alignment),
    z: distance + (-.35 - distance) * pose.travel,
    lookX: .94 * pose.alignment,
    lookY: 1.7 + .3 * (1 - pose.alignment),
    lookZ: -.74,
  };
}

export function createSceneProgress() {
  let progress = 0;
  const listeners = new Set<(value: number) => void>();
  return {
    get: () => progress,
    set(value: number) {
      const next = clamp(value);
      if (next === progress) return;
      progress = next;
      listeners.forEach(listener => listener(progress));
    },
    subscribe(listener: (value: number) => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
  };
}
export type SceneProgress = ReturnType<typeof createSceneProgress>;
