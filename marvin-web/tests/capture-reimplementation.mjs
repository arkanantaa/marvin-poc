import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const base = process.argv[2] || "http://127.0.0.1:4176/";
const output = new URL("../../docs/qa/reimplementation-2026-10-20/", import.meta.url);
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHROMIUM_CHANNEL || "chromium" });
const report = { date: new Date().toISOString(), base, browser: browser.version(), profiles: [] };
report.assets = await Promise.all((await fs.readdir(new URL("../dist/assets/", import.meta.url))).map(async name => ({
  name,
  sha256: createHash("sha256").update(await fs.readFile(new URL(`../dist/assets/${name}`, import.meta.url))).digest("hex"),
})));
try {
  for (const [width, height] of [[1440, 900], [1920, 1080], [390, 844], [360, 800], [320, 800], [844, 390]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    const capture = name => page.screenshot({ path: fileURLToPath(new URL(`${width}-${name}.png`, output)) });
    await page.goto(base);
    await page.locator(".media-surface img").evaluate(image => image.decode());
    await capture("hero");
    await page.getByRole("link", { name: "Our work" }).click();
    await expect(page.getByRole("tab", { name: "The portraits" })).toBeFocused();
    await page.locator(".print img").evaluateAll(images => Promise.all(images.map(image => image.decode())));
    await capture("portraits");
    await page.locator("#work").screenshot({ path: fileURLToPath(new URL(`${width}-monitor.png`, output)) });
    const violations = [];
    for (const tab of ["The portraits", "The experience", "Say hello"]) {
      await page.getByRole("tab", { name: tab }).click();
      await page.getByRole("link", { name: "Our work" }).click();
      await page.waitForTimeout(220);
      await capture(tab === "Say hello" ? "hello" : tab === "The experience" ? "experience" : "portraits");
      violations.push(...(await new AxeBuilder({ page }).analyze()).violations);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.getByRole("tab", { name: "The portraits" }).click();
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: "Next collection" }).click();
      await page.waitForTimeout(220);
      await capture(`collection-${i}`);
    }
    await page.locator(".screen-footer").scrollIntoViewIfNeeded();
    await capture("bottom");
    expect(errors).toEqual([]);
    expect(violations).toEqual([]);
    report.profiles.push({ width, height, dpr: 1, motion: "no-preference", network: "local unthrottled", errors, violations });
    await context.close();
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base);
  const range = await page.locator(".journey").evaluate(el => el.offsetHeight - document.querySelector(".stage").offsetHeight);
  for (const [progress, name] of [[.82, "fade"], [.88, "white"], [.95, "reveal"], [1, "monitor"], [.95, "reverse-reveal"], [.88, "reverse-white"], [0, "reverse-home"]]) {
    await page.evaluate(top => window.scrollTo(0, top), range * progress);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(range * progress, 0);
    await page.waitForTimeout(100);
    await page.screenshot({ path: fileURLToPath(new URL(`${name}.png`, output)) });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("link", { name: "Our work" }).click();
  await page.screenshot({ path: fileURLToPath(new URL("reduced-motion.png", output)) });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await page.getByRole("link", { name: "Our work" }).click();
  await page.screenshot({ path: fileURLToPath(new URL("320-text-200.png", output)) });
  await page.evaluate(() => { document.documentElement.style.fontSize = ""; });
  await page.route("**/portfolio/*", route => route.abort());
  await page.reload();
  await expect(page.locator(".image-fallback")).toHaveCount(3);
  await page.locator("#work").screenshot({ path: fileURLToPath(new URL("320-image-failure.png", output)) });
  await fs.writeFile(new URL("browser-results.json", output), JSON.stringify(report, null, 2));
  console.log(`Captured and checked ${report.profiles.length} viewport profiles. Screenshots still require visual review.`);
} finally {
  await browser.close();
}
