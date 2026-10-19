import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
const url = process.argv[2];
if (!url || !url.startsWith("https://"))
  throw new Error("Supply the exact deployed HTTPS URL");
const browser = await chromium.launch({ channel: "chromium" });
const output = new URL(`../../docs/qa/${process.env.QA_REVIEW_DIR || ''}`, import.meta.url);
await fs.mkdir(output, {recursive:true});
const evidence = {
  url,
  browser: browser.version(),
  checkedAt: new Date().toISOString(),
  build: process.env.BUILD_COMMIT || null,
  profiles: [],
};
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [],
    failed = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      failed.push({ url: response.url(), status: response.status() });
  });
  const capture = async (name) =>
    page.screenshot({
      path: fileURLToPath(
        new URL(
          `production-${viewport.width}-${name}.png`,
          output,
        ),
      ),
    });
  await page.goto(url, { waitUntil: "networkidle" });
  const moduleAsset = await page.locator('script[type="module"]').getAttribute('src');
  if (process.env.EXPECTED_ASSET && !moduleAsset?.endsWith(process.env.EXPECTED_ASSET))
    throw new Error(`Production still serves a different build: ${moduleAsset}`);
  await capture("hero");
  const range = await page
    .locator(".journey")
    .evaluate((el) => el.offsetHeight - innerHeight);
  await page.mouse.wheel(0, range * 0.88);
  await page.waitForTimeout(200);
  if (
    (await page
      .locator(".white-transition")
      .evaluate((el) => el.style.opacity)) !== "1"
  )
    throw new Error("White hold is not opaque");
  await capture("white");
  await page.getByRole("link", { name: "Our work" }).click();
  await capture("work");
  if (viewport.width === 390) {
    await page.mouse.move(200,500);
    await page.mouse.wheel(0,600);
    await expect.poll(() => page.locator('.console').evaluate(el=>el.getBoundingClientRect().bottom)).toBeLessThanOrEqual(viewport.height+1);
    await capture('work-bottom');
    await page.getByRole('link',{name:'Our work'}).click();
  }
  const first = page.getByRole("tab", { name: "The portraits" });
  if (!(await first.evaluate((el) => el === document.activeElement)))
    throw new Error("Shortcut focus missing");
  await first.press("ArrowRight");
  await capture("experience");
  await page.keyboard.press("End");
  await capture("hello");
  await page.keyboard.press("Home");
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Next collection" }).click();
  const violations = (await new AxeBuilder({ page }).analyze()).violations;
  if (violations.length) throw new Error(JSON.stringify(violations));
  await page.getByRole("link", { name: "Marvin Studio home" }).click();
  if (!(await page.locator("#work").evaluate((el) => el.inert)))
    throw new Error("Home did not hide monitor");
  await page.goBack();
  await page.reload();
  await first.waitFor({ state: "visible" });
  await page.mouse.wheel(0, -range);
  await page.waitForTimeout(250);
  if (!(await page.locator("#work").evaluate((el) => el.inert)))
    throw new Error("Reverse did not return to opening");
  await page.getByRole("link", { name: "Our work" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await capture("reduced");
  if (await page.locator("video").getAttribute("src"))
    throw new Error("Unexpected video download in foundation preview");
  if (errors.length || failed.length)
    throw new Error(JSON.stringify({ errors, failed }));
  evidence.profiles.push({
    viewport,
    dpr: 1,
    moduleAsset,
    network: "live HTTPS, new browser context/cold visit",
    errors,
    failed,
    axeViolations: violations.length,
    flows:
      "scroll/white/shortcut/tabs/collections/home/history/deep-link-refresh/reverse/reduced-motion passed",
  });
  await context.close();
}
await fs.writeFile(
  new URL("production.json", output),
  JSON.stringify(evidence, null, 2),
);
await browser.close();
console.log(
  "Production desktop/mobile flows, assets and accessibility passed.",
);
