import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("long content and enlarged text remain reachable at 320 pixels", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("./#work");
  await page.locator(".portfolio-copy h2").evaluate((el) => {
    el.textContent = "A lifetime of memories with every one of the people you love.";
  });
  await page.locator(".portfolio-copy p:not(.eyebrow)").evaluate((el) => {
    el.textContent = `${el.textContent} `.repeat(5);
  });
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.getByRole("tab").evaluateAll(buttons =>
    buttons.every(button => button.scrollWidth <= button.clientWidth))).toBe(true);
  expect(await page.locator(".site-header").evaluate(header => {
    const brand = header.querySelector(".wordmark")!.getBoundingClientRect();
    const navigation = header.querySelector("nav")!.getBoundingClientRect();
    return brand.right + 8 <= navigation.left;
  })).toBe(true);
  await page.getByRole("button", { name: "Next collection" }).click();
  await expect(page.locator(".collection-control")).toContainText("Warm memories");
  await page.locator(".screen-footer").scrollIntoViewIfNeeded();
  await expect(page.locator(".screen-footer")).toBeInViewport();
  await page.getByRole("tab", { name: "The experience" }).click();
  await page.locator(".experience-steps li").last().scrollIntoViewIfNeeded();
  await expect(page.locator(".experience-steps li").last()).toBeInViewport();
  await page.getByRole("tab", { name: "Say hello" }).click();
  await page.locator(".contact-note").scrollIntoViewIfNeeded();
  await expect(page.locator(".contact-note")).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("collection selection survives tabs and direct navigation respects the selected tab", async ({ page }) => {
  await page.goto("./#work");
  await page.getByRole("button", { name: "Next collection" }).click();
  const hello = page.getByRole("tab", { name: "Say hello" });
  await hello.click();
  await page.getByRole("link", { name: "Our work" }).click();
  await expect(hello).toBeFocused();
  await page.getByRole("tab", { name: "The portraits" }).click();
  await expect(page.locator(".collection-control")).toContainText("Warm memories");
  await page.getByRole("link", { name: "Marvin Studio home" }).click();
  await page.goBack();
  await expect(page.locator("#work")).toHaveAttribute("aria-hidden", "false");
  await page.goForward();
  await expect(page.locator("#work")).toHaveAttribute("inert", "");
});
// Small native wheel steps also exercise Firefox's per-event scroll limits.
async function wheelBy(page: Page, delta: number) {
  const start = await page.evaluate(() => scrollY);
  const target = await page.evaluate((value) => Math.max(0, Math.min(value,
    document.documentElement.scrollHeight - innerHeight)), start + delta);
  let current = start;
  while (Math.abs(target - current) > 1) {
    const next = current + Math.max(-180, Math.min(180, target - current));
    await page.mouse.wheel(0, next - current);
    await expect.poll(() => page.evaluate(value => Math.abs(scrollY - value), next)).toBeLessThanOrEqual(1);
    current = await page.evaluate(() => scrollY);
  }
}
test("motion preference changes preserve focus and scroll position", async ({ page }) => {
  await page.goto("./#work");
  const hello = page.getByRole("tab", { name: "Say hello" });
  await hello.click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(hello).toBeFocused();
  await expect(hello).toHaveAttribute("aria-selected", "true");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(hello).toBeFocused();
  await hello.press("Tab");
  await expect(page.getByRole("tabpanel")).toBeFocused();
});

test("resize preserves portfolio reading offset; reduced motion bypasses the long entrance", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await page.goto("./#work");
  const readingOffset = () => page.evaluate(() => scrollY -
    (document.querySelector<HTMLElement>(".journey")!.offsetHeight -
      document.querySelector<HTMLElement>(".stage")!.offsetHeight));
  await expect(page.getByRole("tab", { name: "The portraits" })).toBeFocused();
  await page.mouse.move(180, 400);
  await page.mouse.wheel(0, 180);
  await expect.poll(readingOffset).toBeGreaterThan(150);
  const before = await readingOffset();
  await page.setViewportSize({ width: 390, height: 620 });
  await expect.poll(readingOffset).toBeGreaterThan(before - 5);
  await page.getByRole("link", { name: "Marvin Studio home" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.mouse.move(180, 400);
  await page.mouse.wheel(0, 40);
  await expect(page.locator("#work")).toHaveAttribute("aria-hidden", "false");
  await expect.poll(readingOffset).toBeGreaterThanOrEqual(-2);
});
test("clean opening, shortcut, collections, keyboard tabs, home and history", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await expect(page.locator("#work")).toHaveAttribute("inert", "");
  await expect(page.locator(".booth-renderer")).toBeVisible();
  await expect(page.locator("video")).toHaveCount(0);
  const shortcut = page.getByRole("link", { name: "Our work" });
  if (test.info().project.name === "mobile") await shortcut.tap();
  else await shortcut.click();
  await expect(page.getByRole("tab", { name: "The portraits" })).toBeFocused();
  await page.getByRole("button", { name: "Previous collection" }).click();
  await expect(page.locator(".collection-control")).toContainText(
    "After hours",
  );
  await page.getByRole("button", { name: "Next collection" }).click();
  await expect(page.locator(".collection-control")).toContainText(
    "The classics",
  );
  const first = page.getByRole("tab", { name: "The portraits" });
  await first.focus();
  await first.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "The experience" })).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Say hello" })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("not connected yet");
  await page.keyboard.press("Home");
  await expect(first).toBeFocused();
  await first.press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Say hello" })).toBeFocused();
  await page.keyboard.press("Home");
  await first.press("Tab");
  await expect(page.getByRole("tabpanel")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(first).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("link", { name: "Marvin Studio home" }).click();
  await expect(page.locator("#work")).toHaveAttribute("inert", "");
  await page.goBack();
  await expect(first).toBeFocused();
  await page.reload();
  await expect(first).toBeFocused();
  expect(errors).toEqual([]);
});
test("native scroll, white hold, reverse focus and same-fragment shortcut", async ({
  page,
}) => {
  await page.goto("./");
  const range = await page
    .locator(".journey")
    .evaluate((el) => (el as HTMLElement).offsetHeight - innerHeight);
  await page.mouse.move(180, 400);
  await wheelBy(page, range * 0.88);
  await page.waitForTimeout(200);
  await expect(page.locator(".white-transition")).toHaveCSS("opacity", "1");
  await expect(page.locator("#work")).toHaveAttribute("inert", "");
  await wheelBy(page, range);
  await page.waitForTimeout(200);
  await expect(page.getByRole("tab", { name: "The portraits" })).toBeVisible();
  await page.getByRole("link", { name: "Our work" }).click();
  await page.mouse.move(180, 400);
  await wheelBy(page, -range);
  await page.waitForTimeout(200);
  await expect(
    page.getByRole("link", { name: "Marvin Studio home" }),
  ).toBeFocused();
  await page.getByRole("link", { name: "Our work" }).click();
  await expect(page.getByRole("tab", { name: "The portraits" })).toBeFocused();
});
test("reduced motion, resize, failed images and reflow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/portfolio/*", (route) => route.abort());
  await page.goto("./#work");
  await expect(page.getByRole("tab", { name: "The portraits" })).toBeFocused();
  await expect(page.locator(".image-fallback")).toHaveCount(3);
  await expect(page.locator("video")).toHaveCount(0);
  await page.setViewportSize({ width: 320, height: 800 });
  await expect(
    page.getByRole("button", { name: "Next collection" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.getByRole("tab", { name: "The portraits" })).toBeVisible();
});
