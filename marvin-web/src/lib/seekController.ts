export type SeekState = { target: number; ready: boolean; failed: boolean };
export type SeekSurface = { currentTime: number; seeking: boolean };
// Retain one target, never a FIFO. The seeked listener calls this again.
export function seekLatest(surface: SeekSurface, state: SeekState) {
  if (!state.ready || state.failed || surface.seeking) return;
  if (Math.abs(surface.currentTime - state.target) > 0.035)
    surface.currentTime = state.target;
}
