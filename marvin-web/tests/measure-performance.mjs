import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chromium" });
const results = [];
for (let i = 0; i < 3; i++) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: 1600000 / 8,
    uploadThroughput: 750000 / 8,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(() => {
    window.metrics = { lcp: 0, cls: 0, longestEvent: 0 };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.metrics.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        if (!e.hadRecentInput) window.metrics.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        window.metrics.longestEvent = Math.max(
          window.metrics.longestEvent,
          e.duration,
        );
    }).observe({ type: "event", buffered: true, durationThreshold: 16 });
  });
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.locator(".media-surface img").evaluate((img) => img.decode());
  await page.waitForTimeout(300);
  const initial = await page.evaluate(() => ({
    ...window.metrics,
    transferBytes: performance
      .getEntriesByType("resource")
      .reduce((n, e) => n + e.transferSize, 0),
  }));
  await page.getByRole("link", { name: "Our work" }).click();
  await page.getByRole("button", { name: "Next collection" }).click();
  await page.waitForTimeout(300);
  results.push({
    run: i + 1,
    ...initial,
    longestObservedEvent: await page.evaluate(
      () => window.metrics.longestEvent,
    ),
  });
  await context.close();
}
await fs.writeFile(
  new URL("../../docs/qa/performance.json", import.meta.url),
  JSON.stringify(
    {
      browser: browser.version(),
      profile:
        "Windows Chromium, 390x844 DPR1 touch emulation; 4x CPU; 1.6Mbps down, 750Kbps up, 150ms latency, cache disabled; HTTP local preview; local transport uncompressed",
      results,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(results));
await browser.close();
