import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("clean opening, shortcut, collections, keyboard tabs, home and history", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await expect(page.locator("#work")).toHaveAttribute("inert", "");
  await expect(page.locator(".media-surface img")).toBeVisible();
  await expect(page.locator("video")).not.toHaveAttribute("src");
  await page.getByRole("link", { name: "Our work" }).click();
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
  await page.mouse.wheel(0, range * 0.88);
  await page.waitForTimeout(200);
  await expect(page.locator(".white-transition")).toHaveCSS("opacity", "1");
  await expect(page.locator("#work")).toHaveAttribute("inert", "");
  await page.mouse.wheel(0, range);
  await page.waitForTimeout(200);
  await expect(page.getByRole("tab", { name: "The portraits" })).toBeVisible();
  await page.getByRole("link", { name: "Our work" }).click();
  await page.mouse.wheel(0, -range);
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
  await expect(page.locator("video")).not.toHaveAttribute("src");
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
