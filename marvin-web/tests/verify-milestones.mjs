import { chromium, firefox, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const base = process.argv[2] || 'http://127.0.0.1:4176/';
const output = new URL('../../docs/qa/review-2026-10-19/', import.meta.url);
await fs.mkdir(output, { recursive: true });
const engine = process.env.REVIEW_BROWSER || 'chromium';
const browser = await ({chromium, firefox}[engine]).launch(engine === 'chromium' ? { channel: 'chromium' } : {});
const report = { date: new Date().toISOString(), base, browser: browser.version(), profiles: [] };
for (const [width, height] of [[1440,900],[1920,1080],[390,844],[360,800],[844,390],[768,1024],[1024,768],[320,800]]) {
  const context = await browser.newContext({ viewport: {width,height}, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const capture = async name => page.screenshot({path: fileURLToPath(new URL(`${width}x${height}-${name}.png`, output))});
  await page.goto(base);
  await page.locator('.media-surface img').evaluate(img => img.decode());
  await capture('hero');
  await page.getByRole('link', {name:'Our work'}).click();
  await expect(page.getByRole('tab', {name:'The portraits'})).toBeFocused();
  await capture('portraits');
  for (let i=0;i<3;i++) {
    await page.getByRole('button', {name:'Next collection'}).click();
    await capture(`collection-${i}`);
  }
  for (const name of ['The experience', 'Say hello']) {
    await page.getByRole('tab', {name}).click();
    await capture(name === 'Say hello' ? 'hello' : 'experience');
  }
  const violations = (await new AxeBuilder({page}).analyze()).violations;
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  report.profiles.push({width,height,dpr:1,motion:'no-preference',network:'unthrottled',errors,overflow,violations});
  expect(errors).toEqual([]);
  expect(overflow).toBe(false);
  expect(violations).toEqual([]);
  await context.close();
}
const context = await browser.newContext({viewport:{width:1440,height:900}});
const page = await context.newPage();
await page.goto(base);
const range = await page.locator('.journey').evaluate(el => el.offsetHeight - document.querySelector('.stage').offsetHeight);
for (const [progress,name] of [[0.82,'fade'],[0.88,'white'],[0.95,'reveal'],[1,'monitor'],[0.95,'reverse-reveal'],[0.88,'reverse-white'],[0.5,'reverse-poster']]) {
  await page.mouse.wheel(0, range*progress-await page.evaluate(()=>scrollY));
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeCloseTo(range*progress,0);
  await page.screenshot({path:fileURLToPath(new URL(`${name}.png`,output))});
}
await page.goto(`${base}#work`);
await page.evaluate(()=>document.documentElement.style.zoom='2');
await page.getByRole('tab',{name:'The portraits'}).scrollIntoViewIfNeeded();
await page.screenshot({path:fileURLToPath(new URL('zoom-200.png',output))});
expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
report.zoom = '200% CSS zoom at 1440x900; reflow and controls inspected; native browser zoom and screen reader remain unverified';
await context.close();
await fs.writeFile(new URL('results.json', output), JSON.stringify(report,null,2));
await browser.close();
console.log(JSON.stringify(report,null,2));
