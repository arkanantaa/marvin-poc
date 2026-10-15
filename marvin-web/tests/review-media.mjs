import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chromium" });
const results = [];
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport });
  await page.goto("http://127.0.0.1:4175/");
  await page.waitForFunction(
    () => document.querySelector("video").readyState >= 2,
  );
  const range = await page
    .locator(".journey")
    .evaluate((el) => el.offsetHeight - innerHeight);
  const samples = [];
  for (const progress of [
    0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.78, 0.6, 0.4, 0.2, 0.08,
  ]) {
    await page.mouse.wheel(
      0,
      range * progress - (await page.evaluate(() => scrollY)),
    );
    await page.waitForTimeout(250);
    samples.push(
      await page
        .locator("video")
        .evaluate((el) => ({
          time: el.currentTime,
          paused: el.paused,
          seeking: el.seeking,
          ready: el.readyState,
        })),
    );
  }
  await page.mouse.wheel(0, range * 0.5);
  await page.waitForTimeout(350);
  const stop = await page.locator("video").evaluate((el) => el.currentTime);
  await page.waitForTimeout(500);
  const held = await page.locator("video").evaluate((el) => el.currentTime);
  if (stop !== held)
    throw new Error("Video did not hold its selected timestamp");
  await page.mouse.wheel(0, range * 0.2);
  await page.mouse.wheel(0, -range * 0.35);
  await page.waitForTimeout(400);
  const latest = await page
    .locator("video")
    .evaluate((el) => ({
      time: el.currentTime,
      paused: el.paused,
      seeking: el.seeking,
    }));
  if (samples.some((s) => !s.paused || s.ready < 2) || latest.seeking)
    throw new Error("Seek did not settle");
  results.push({ viewport, samples, stop, held, latest });
  await page.close();
}
const blocked = await browser.newPage();
await blocked.route("**/media/entrance.mp4", (route) => route.abort());
await blocked.goto("http://127.0.0.1:4175/");
await blocked.mouse.wheel(0, 500);
await blocked
  .getByRole("tab", { name: "The portraits" })
  .waitFor({ state: "visible" });
results.push({ blockedVideo: "usable monitor after failure" });
const delayed = await browser.newPage();
await delayed.route("**/media/entrance.mp4", async (route) => {
  await new Promise((resolve) => setTimeout(resolve, 6500));
  await route.abort();
});
await delayed.goto("http://127.0.0.1:4175/", { waitUntil: "domcontentloaded" });
await delayed.mouse.wheel(0, 600);
await delayed
  .getByRole("tab", { name: "The portraits" })
  .waitFor({ state: "visible", timeout: 6000 });
results.push({ stalledVideo: "usable monitor within 6 seconds after intent" });
await fs.writeFile(
  new URL("../../docs/qa/media-controller.json", import.meta.url),
  JSON.stringify(
    {
      browser: browser.version(),
      note: "Development fixture only: rejected choreography; no claim of approved-video release readiness",
      results,
    },
    null,
    2,
  ),
);
await browser.close();
console.log(
  "Single-video hold, reverse, latest-target, error and stalled-request checks passed.",
);
