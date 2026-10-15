import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
const output = new URL("../../docs/qa/", import.meta.url);
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chromium" });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const capture = async (name) =>
  page.screenshot({
    path: fileURLToPath(new URL(`${name}.png`, output)),
  });
const metadata = {
  date: "2026-10-15",
  browser: browser.version(),
  dpr: 1,
  motion: "no-preference",
  network: "local unthrottled",
  captures: [],
};
await page.goto("http://127.0.0.1:4174/marvin-poc/dist/");
await capture("baseline-desktop");
await page.setViewportSize({ width: 390, height: 844 });
await capture("baseline-mobile");
for (const [width, height] of [
  [1440, 900],
  [1920, 1080],
  [390, 844],
  [360, 800],
  [844, 390],
  [320, 800],
]) {
  await page.setViewportSize({ width, height });
  await page.goto("http://127.0.0.1:4173/");
  await page.locator(".media-surface img").waitFor({ state: "visible" });
  await page.waitForTimeout(100);
  await capture(`${width}x${height}-hero`);
  await page.getByRole("link", { name: "Our work" }).click();
  await page.waitForTimeout(300);
  await capture(`${width}x${height}-monitor`);
  metadata.captures.push({
    width,
    height,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  });
}
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto("http://127.0.0.1:4173/");
const range = await page
  .locator(".journey")
  .evaluate((el) => el.offsetHeight - innerHeight);
for (const [progress, name] of [
  [0.82, "fade-midpoint"],
  [0.88, "white-hold"],
  [0.95, "monitor-midpoint"],
  [1, "monitor-full"],
]) {
  await page.mouse.wheel(
    0,
    range * progress - (await page.evaluate(() => scrollY)),
  );
  await page.waitForTimeout(180);
  await capture(name);
}
for (const name of ["The experience", "Say hello", "The portraits"]) {
  await page.getByRole("tab", { name }).click();
  await capture(`tab-${name.replaceAll(" ", "-")}`);
}
for (let i = 0; i < 3; i++) {
  await page.getByRole("button", { name: "Next collection" }).click();
  await page.waitForTimeout(250);
  await capture(`collection-${i}`);
}
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto("http://127.0.0.1:4173/#work");
await capture("reduced-motion-work");
await fs.writeFile(
  new URL("browser-metadata.json", output),
  JSON.stringify(metadata, null, 2),
);
await browser.close();
