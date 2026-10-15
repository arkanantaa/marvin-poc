import { describe, it, expect } from "vitest";
import { seekLatest } from "../../src/lib/seekController";
describe("latest-target seeking", () => {
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
