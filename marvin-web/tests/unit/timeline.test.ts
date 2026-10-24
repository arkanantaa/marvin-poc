import { describe, expect, it } from "vitest";
import { cameraPose, createSceneProgress, timeline, wrap } from "../../src/lib/timeline";

describe("3D entrance choreography", () => {
  it("keeps the camera fixed during curtain opening and the open-door hold", () => {
    const first = cameraPose(0, 9);
    for (const progress of [.08, .22, .36, .42]) expect(cameraPose(progress, 9)).toEqual(first);
    expect(timeline(.22).curtain).toBeCloseTo(.5);
    expect(timeline(.36).curtain).toBe(1);
    expect(timeline(.42).travel).toBe(0);
  });
  it("aligns with the clear doorway before crossing its front plane", () => {
    for (let progress = .43; progress <= .78; progress += .005) {
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
  it("bounds invalid input and retains opaque white before interaction", () => {
    for (const value of [-1, NaN, Infinity]) expect(timeline(value).progress).toBe(0);
    expect(timeline(2).progress).toBe(1);
    for (const value of [.86, .88, .9]) expect(timeline(value)).toMatchObject({ white: 1, monitor: 0, interactive: false });
    expect(timeline(.95).monitor).toBeCloseTo(.5);
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
