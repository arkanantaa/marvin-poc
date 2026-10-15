import { describe, expect, it } from "vitest";
import { timeline, wrap } from "../../src/lib/timeline";
describe("entrance timeline", () => {
  it("clamps invalid input and unusable durations", () => {
    for (const p of [-5, NaN, -Infinity]) expect(timeline(p).progress).toBe(0);
    expect(timeline(5).progress).toBe(1);
    for (const duration of [NaN, Infinity, -1, 0])
      expect(timeline(0.5, duration).time).toBe(0);
  });
  it("keeps the opaque interval separate from monitor interaction", () => {
    expect(timeline(0.08, 4).time).toBe(0);
    expect(timeline(0.78, 4).time).toBeCloseTo(3.95);
    expect(timeline(0.86)).toMatchObject({
      white: 1,
      monitor: 0,
      interactive: false,
    });
    expect(timeline(0.9)).toMatchObject({
      white: 1,
      monitor: 0,
      interactive: false,
    });
    expect(timeline(0.95).monitor).toBeCloseTo(0.5);
    expect(timeline(0.999).interactive).toBe(false);
    expect(timeline(1)).toMatchObject({ monitor: 1, interactive: true });
  });
  it("is reversible without history or playback accumulation", () => {
    const progress = [0.1, 0.3, 0.7, 0.4, 0.1];
    expect(progress.map((p) => timeline(p, 5).time)[0]).toBe(
      timeline(0.1, 5).time,
    );
    expect(timeline(0.4, 5).time).toBeLessThan(timeline(0.7, 5).time);
  });
  it("wraps collection and tab boundaries in both directions", () => {
    expect(wrap(-1, 3)).toBe(2);
    expect(wrap(3, 3)).toBe(0);
  });
});
