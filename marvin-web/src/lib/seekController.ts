export type SeekState = { target: number; ready: boolean; failed: boolean };
export type SeekSurface = { currentTime: number; seeking: boolean };
// Retain one target, never a FIFO. The seeked listener calls this again.
export function seekLatest(surface: SeekSurface, state: SeekState) {
  if (!state.ready || state.failed || surface.seeking) return;
  if (!Number.isFinite(state.target) || state.target < 0) {
    state.failed = true;
    return;
  }
  if (Math.abs(surface.currentTime - state.target) > 0.035) {
    try {
      surface.currentTime = state.target;
    } catch {
      // An unseekable decoder must take the bounded fallback route.
      state.failed = true;
    }
  }
}
