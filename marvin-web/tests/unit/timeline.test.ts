import { describe, expect, it } from "vitest";
import { cameraPose, createSceneProgress, timeline, wrap } from "../../src/lib/timeline";

describe("3D entrance choreography", () => {
  it("opens the curtain and advances the camera together without an open-door pause", () => {
    const first = cameraPose(0, 9);
    expect(first.x).toBe(first.lookX);
    expect(first.x).toBe(0);
    for (const progress of [.08, .22, .36, .42]) {
      expect(cameraPose(progress, 9).z).toBeLessThan(first.z);
      expect(timeline(progress).curtain).toBeGreaterThan(0);
      expect(timeline(progress).travel).toBeGreaterThan(0);
    }
    expect(timeline(.31).curtain).toBeCloseTo(.5);
    expect(timeline(.60).curtain).toBe(1);
  });
  it("aligns with the clear doorway before crossing its front plane", () => {
    for (let progress = .02; progress <= .78; progress += .005) {
      const view = cameraPose(progress, 9);
      expect(view.y).toBe(view.lookY);
      if (view.z < .9) {
        expect(view.x).toBeCloseTo(.94);
        expect(timeline(progress).curtain).toBe(1);
      }
    }
    expect(cameraPose(.78, 9)).toMatchObject({ x: .94, y: 1.7, lookX: .94 });
    expect(cameraPose(.78, 9).z).toBeCloseTo(-.35);
  });
  it("holds and reverses the exact same poses without elapsed time", () => {
    for (const progress of [0, .22, .4, .6, .78]) {
      const before = timeline(progress);
      timeline(1);
      expect(timeline(progress)).toEqual(before);
    }
    expect(cameraPose(.6, 9).z).toBeGreaterThan(cameraPose(.7, 9).z);
  });
  it("limits sudden enlargement during the doorway approach on wide and narrow screens", () => {
    for (const distance of [8.5, 15]) {
      let previousScale = 1 / (cameraPose(.02, distance).z + .74);
      for (let step = 1; step <= 62; step++) {
        const view = cameraPose(.02 + step * .01, distance);
        const scale = 1 / (view.z + .74);
        expect(scale / previousScale).toBeLessThan(1.2);
        expect(scale).toBeGreaterThanOrEqual(previousScale);
        if (view.z < .9) expect(view.x).toBeCloseTo(.94, 2);
        previousScale = scale;
      }
    }
  });
  it("joins the approach to the doorway crossing without a sudden velocity change", () => {
    const step = .00001;
    const before = (cameraPose(.64, 9).z - cameraPose(.64 - step, 9).z) / step;
    const after = (cameraPose(.64 + step, 9).z - cameraPose(.64, 9).z) / step;
    expect(after).toBeCloseTo(before, 1);
    expect(cameraPose(.64, 9).z).toBeGreaterThan(.82);
    expect(timeline(.70).monitor).toBeGreaterThan(0);
  });
  it("bounds invalid input and dissolves directly into the portfolio before interaction", () => {
    for (const value of [-1, NaN, Infinity]) expect(timeline(value).progress).toBe(0);
    expect(timeline(2).progress).toBe(1);
    expect(timeline(.56).monitor).toBe(0);
    expect(timeline(.78).monitor).toBeCloseTo(.5);
    for (const value of [.70, .82, .9]) {
      expect(timeline(value).monitor).toBeGreaterThan(0);
      expect(timeline(value).monitor).toBeLessThan(1);
      expect(timeline(value).interactive).toBe(false);
    }
    expect(timeline(.999).interactive).toBe(false);
    expect(timeline(1).interactive).toBe(true);
  });
  it("notifies subscribers only for changed poses and cleans up", () => {
    const progress = createSceneProgress();
    const values: number[] = [];
    const unsubscribe = progress.subscribe(value => values.push(value));
    progress.set(.5); progress.set(.5); progress.set(.2);
    unsubscribe(); progress.set(.8);
    expect(values).toEqual([.5, .2]);
    expect(progress.get()).toBe(.8);
  });
  it("wraps collection navigation", () => {
    expect(wrap(-1, 3)).toBe(2);
    expect(wrap(3, 3)).toBe(0);
  });
});
