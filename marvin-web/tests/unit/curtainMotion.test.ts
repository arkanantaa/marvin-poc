import { describe, expect, it } from "vitest";
import { createCurtainMotion, curtainVertex } from "../../src/scene/curtainMotion";

describe("soft curtain", () => {
  it("pins the rail but allows the free hem to move", () => {
    for (const u of [0, .25, .5, .75, 1]) {
      expect(curtainVertex(u, 0, .5, .1)).toEqual(curtainVertex(u, 0, .5, 0));
    }
    expect(curtainVertex(.7, 1, .5, .1).x).not.toBe(curtainVertex(.7, 1, .5).x);
  });
  it("responds to movement, reverses, and comes to an exact rest", () => {
    const motion = createCurtainMotion(0);
    expect(motion.step(0, 1 / 60).active).toBe(false);
    expect(motion.step(.5, 1 / 60).displacement).toBeGreaterThan(0);
    for (let i = 0; i < 160; i++) motion.step(.5, 1 / 60);
    expect(motion.step(.5, 1 / 60)).toEqual({ displacement: 0, active: false });
    expect(motion.step(0, 1 / 60).displacement).toBeLessThan(0);
  });
  it("keeps a gathered curtain clear of the camera, even during settling", () => {
    for (let u = 0; u <= 1; u += .025) {
      for (let v = 0; v <= 1; v += .025) {
        for (const sway of [-.13, 0, .13]) {
          const point = curtainVertex(u, v, 1, sway);
          expect(point.x).toBeLessThan(.74);
          expect(point.y).toBeGreaterThan(.15);
        }
      }
    }
  });
  it("has consistent damping at 30 and 120 fps and bounds suspension jumps", () => {
    const simulate = (fps: number) => {
      const motion = createCurtainMotion(0);
      let result = motion.step(.7, 1 / fps);
      for (let i = 1; i < fps / 2; i++) result = motion.step(.7, 1 / fps);
      return result.displacement;
    };
    expect(simulate(30)).toBeCloseTo(simulate(120), 6);
    const motion = createCurtainMotion(0);
    expect(Math.abs(motion.step(1, 60).displacement)).toBeLessThanOrEqual(.13);
  });
});
