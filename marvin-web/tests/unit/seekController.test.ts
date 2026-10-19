import { describe, it, expect } from "vitest";
import { seekLatest } from "../../src/lib/seekController";
describe("latest-target seeking", () => {
  it("routes rejected decoder seeks to failure instead of throwing during scroll", () => {
    const surface = {
      seeking: false,
      get currentTime() { return 0; },
      set currentTime(_time: number) { throw new Error("Unsupported seek"); },
    };
    const state = { target: 2, ready: true, failed: false };
    expect(() => seekLatest(surface, state)).not.toThrow();
    expect(state.failed).toBe(true);
  });
  it.each([NaN, Infinity, -1])("rejects invalid decoder target %s", (target) => {
    const surface = { currentTime: 0, seeking: false };
    const state = { target, ready: true, failed: false };
    seekLatest(surface, state);
    expect(state.failed).toBe(true);
    expect(surface.currentTime).toBe(0);
  });
  it("waits for pending seek then consumes only newest reverse target", () => {
    const surface = { currentTime: 1, seeking: true };
    const state = { target: 3, ready: true, failed: false };
    seekLatest(surface, state);
    expect(surface.currentTime).toBe(1);
    state.target = 4;
    seekLatest(surface, state);
    state.target = 0.5;
    seekLatest(surface, state);
    surface.seeking = false;
    seekLatest(surface, state);
    expect(surface.currentTime).toBe(0.5);
    seekLatest(surface, state);
    expect(surface.currentTime).toBe(0.5);
  });
  it("keeps poster/failure capability separate from timeline", () => {
    const surface = { currentTime: 0, seeking: false };
    const state = { target: 2, ready: false, failed: false };
    seekLatest(surface, state);
    expect(surface.currentTime).toBe(0);
    state.ready = true;
    state.failed = true;
    seekLatest(surface, state);
    expect(surface.currentTime).toBe(0);
  });
});
