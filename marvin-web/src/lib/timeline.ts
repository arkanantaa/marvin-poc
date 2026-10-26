export const clamp = (value: number) => Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
const segment = (p: number, start: number, end: number) => clamp((p - start) / (end - start));
const ease = (t: number) => t * t * (3 - 2 * t);

// Pure, reversible rail/camera poses. Secondary fabric movement settles around
// these targets without advancing the scroll timeline or moving the camera.
export function timeline(progress: number) {
  const p = clamp(progress);
  return {
    progress: p,
    phase: p < .02 ? "booth" : p < .56 ? "entering" : p < 1 ? "dissolve" : "monitor",
    curtain: ease(segment(p, .02, .60)),
    alignment: ease(segment(p, .02, .50)),
    travel: ease(segment(p, .02, .78)),
    monitor: ease(segment(p, .56, 1)),
    interactive: p >= 1,
  };
}
export const wrap = (index: number, length: number) => ((index % length) + length) % length;

export function cameraPose(progress: number, distance: number) {
  const p = clamp(progress);
  const pose = timeline(p);
  // Approach at a steady change in apparent scale, then walk through the
  // opening. A matched tangent joins both segments without a pause or lurch.
  const facadeZ = .82, clearance = .9, endZ = -.35;
  const startClearance = Math.max(clearance, distance - facadeZ);
  const approach = segment(p, .02, .64);
  const pace = approach * approach * (2 - approach);
  const logRatio = Math.log(startClearance / clearance);
  const entryZ = facadeZ + clearance;
  let z = facadeZ + startClearance * Math.exp(-logRatio * pace);
  if (p > .64) {
    const t = segment(p, .64, .78);
    const tangent = -clearance * logRatio / .62 * .14;
    z = (2 * t ** 3 - 3 * t ** 2 + 1) * entryZ
      + (t ** 3 - 2 * t ** 2 + t) * tangent
      + (-2 * t ** 3 + 3 * t ** 2) * endZ;
  }
  return {
    x: .94 * pose.alignment,
    y: 1.7 + .3 * (1 - pose.alignment),
    z,
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
